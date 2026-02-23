import Product from "../../models/Product.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getAllProducts = asyncHandler(async (req, res) => {

  const products = await Product.find({ isActive: true });

  res.status(200).json(products);

});
