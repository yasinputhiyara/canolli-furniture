import Product from "../../models/Product.js";
import asyncHandler from "../../utils/asyncHandler.js";
import mongoose from "mongoose";

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true }).populate("category", "name");
  res.status(200).json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("Invalid Product ID format");
  }

  const product = await Product.findById(id).populate("category", "name");
  
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  
  res.status(200).json(product);
});
