import Category from "../../models/Category.js";
import Product from "../../models/Product.js";
import asyncHandler from "../../utils/asyncHandler.js";
import cloudinary from "../../config/cloudinary.js";

const extractPublicId = (url) => {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const pathWithVersion = parts[1];
    const pathWithoutVersion = pathWithVersion.substring(pathWithVersion.indexOf("/") + 1);
    return pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
  } catch (e) {
    return null;
  }
};

export const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existing) {
    res.status(400);
    throw new Error("Category already exists");
  }

  let bannerUrl = "";
  if (req.file) {
    const uploaded = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "canolli-categories/banners" }
    );
    bannerUrl = uploaded.secure_url;
  }

  const category = await Category.create({ 
    name, 
    description: description || "", 
    bannerImage: bannerUrl 
  });

  res.status(201).json({
    message: "Category created successfully",
    category
  });
});

export const getAllAdminCategories = asyncHandler(async (req, res) => {
  // Can add counts for products here if needed
  const categories = await Category.find({}).sort({ createdAt: -1 });
  
  // To avoid heavy queries on every list, we could do an aggregate
  // but for a small catalog, this is fine
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const productCount = await Product.countDocuments({ category: cat._id });
      return { ...cat.toObject(), productCount };
    })
  );

  res.status(200).json(categoriesWithCounts);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  let category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (name && name !== category.name) {
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      res.status(400);
      throw new Error("Another category with this name already exists");
    }
    category.name = name;
  }

  if (description !== undefined) {
    category.description = description;
  }

  if (req.file) {
    // Destroy old banner if exists
    if (category.bannerImage) {
      const publicId = extractPublicId(category.bannerImage);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    const uploaded = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "canolli-categories/banners" }
    );
    category.bannerImage = uploaded.secure_url;
  }

  await category.save();

  res.status(200).json({ message: "Category updated successfully", category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const productsUnderCategory = await Product.countDocuments({ category: id });
  if (productsUnderCategory > 0) {
    res.status(400);
    throw new Error(`Cannot delete category. There are ${productsUnderCategory} products using this category.`);
  }

  if (category.bannerImage) {
    const publicId = extractPublicId(category.bannerImage);
    if (publicId) await cloudinary.uploader.destroy(publicId);
  }

  await Category.deleteOne({ _id: id });

  res.status(200).json({ message: "Category deleted successfully" });
});