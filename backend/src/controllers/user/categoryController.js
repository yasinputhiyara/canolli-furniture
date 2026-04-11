import Category from "../../models/Category.js";
import asyncHandler from "../../utils/asyncHandler.js";

// @desc    Get all active categories
// @route   GET /api/v1/categories
// @access  Public
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.status(200).json(categories);
});
