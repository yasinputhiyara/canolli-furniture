import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import asyncHandler from "../../utils/asyncHandler.js";
import cloudinary from "../../config/cloudinary.js";
import slugify from "slugify";

const extractPublicId = (url) => {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const pathWithVersion = parts[1];
    const pathWithoutVersion = pathWithVersion.substring(pathWithVersion.indexOf("/") + 1);
    const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
    return publicId;
  } catch (e) {
    return null;
  }
};

export const addProduct = asyncHandler(async (req, res) => {

  const { name, price, discountPrice, description, stock, category, material } = req.body;

  if (!name || !price) {
    res.status(400);
    throw new Error("Name and price are required");
  }

  const slug = slugify(name, { lower: true, strict: true });

  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    res.status(400);
    throw new Error("Product already exists");
  }

  let categoryId = null;
  if (category) {
    let cat = await Category.findOne({ name: category });
    if (!cat) {
      cat = await Category.create({ name: category });
    }
    categoryId = cat._id;
  }

  let imageUrls = [];
  let videoUrls = [];



  if (req.files?.images) {
    for (const file of req.files.images) {
      const uploaded = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "canolli-products/images" }
      );
      imageUrls.push(uploaded.secure_url);
    }
  }

  if (req.files?.videos) {
    for (const file of req.files.videos) {
      const uploaded = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "canolli-products/videos",
          resource_type: "video"
        }
      );
      videoUrls.push(uploaded.secure_url);
    }
  }

  const product = await Product.create({
    name,
    slug,
    price,
    discountPrice,
    category: categoryId,
    description,
    material,
    stock,
    images: imageUrls,
    videos: videoUrls,
    isActive: true
  });

  res.status(201).json({
    message: "Product added successfully",
    product
  });

});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("category", "name").sort({ createdAt: -1 });
  res.status(200).json({ products });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, discountPrice, description, stock, category, material } = req.body;

  let product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Handle existing media tracking
  // Front-end should send existingImages and existingVideos as arrays of URLs it wants to KEEP.
  let existingImagesToKeep = Array.isArray(req.body.existingImages) 
    ? req.body.existingImages 
    : (req.body.existingImages ? [req.body.existingImages] : []);
    
  let existingVideosToKeep = Array.isArray(req.body.existingVideos) 
    ? req.body.existingVideos 
    : (req.body.existingVideos ? [req.body.existingVideos] : []);

  // Compute what has been deleted by taking the difference and delete them from Cloudinary
  const imagesToDestroy = (product.images || []).filter(url => !existingImagesToKeep.includes(url));
  const videosToDestroy = (product.videos || []).filter(url => !existingVideosToKeep.includes(url));

  for (const url of imagesToDestroy) {
    const publicId = extractPublicId(url);
    if (publicId) await cloudinary.uploader.destroy(publicId);
  }
  
  for (const url of videosToDestroy) {
    const publicId = extractPublicId(url);
    if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  }

  let finalImages = [...existingImagesToKeep];
  let finalVideos = [...existingVideosToKeep];

  // Upload newly appended files
  if (req.files?.images) {
    for (const file of req.files.images) {
      const uploaded = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "canolli-products/images" }
      );
      finalImages.push(uploaded.secure_url);
    }
  }

  if (req.files?.videos) {
    for (const file of req.files.videos) {
      const uploaded = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "canolli-products/videos", resource_type: "video" }
      );
      finalVideos.push(uploaded.secure_url);
    }
  }

  // Update categorical linking
  let categoryId = product.category;
  if (category) {
    let cat = await Category.findOne({ name: category });
    if (!cat) cat = await Category.create({ name: category });
    categoryId = cat._id;
  }

  product.name = name || product.name;
  product.slug = name ? slugify(name, { lower: true, strict: true }) : product.slug;
  product.price = price !== undefined ? price : product.price;
  product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
  product.description = description !== undefined ? description : product.description;
  product.stock = stock !== undefined ? stock : product.stock;
  product.material = material !== undefined ? material : product.material;
  product.category = categoryId;
  product.images = finalImages;
  product.videos = finalVideos;

  await product.save();

  res.status(200).json({ message: "Product updated", product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Destroy all active media on Cloudinary
  if (product.images && product.images.length > 0) {
    for (const url of product.images) {
      const publicId = extractPublicId(url);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }
  }
  
  if (product.videos && product.videos.length > 0) {
    for (const url of product.videos) {
      const publicId = extractPublicId(url);
      if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    }
  }

  await Product.deleteOne({ _id: product._id });
  res.status(200).json({ message: "Product deleted safely" });
});