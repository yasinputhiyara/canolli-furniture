import Product from "../../models/Product.js";
import asyncHandler from "../../utils/asyncHandler.js";
import cloudinary from "../../config/cloudinary.js";
import slugify from "slugify";

export const addProduct = asyncHandler(async (req, res) => {

  const { name, price, description, stock, category } = req.body;

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



  let imageUrls = [];
  let videoUrls = [];

  console.log("FILES:", req.files);

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
    category,
    description,
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