import Category from "../../models/Category.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const addCategory = asyncHandler(async (req, res) => {

  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const existing = await Category.findOne({ name });

  if (existing) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({ name });

  res.status(201).json({
    message: "Category created successfully",
    category
  });

});