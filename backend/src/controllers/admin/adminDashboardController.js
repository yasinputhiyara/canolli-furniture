import asyncHandler from "../../utils/asyncHandler.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";

// @desc    Get dashboard statistics
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const products = await Product.countDocuments();
  const customers = await User.countDocuments({ role: "user" });
  
  // Return mocked orders & revenue for now or query Order model if you have it
  res.status(200).json({
    products,
    customers,
    orders: 56, // Placeholder
    revenue: 1250000 // Placeholder
  });
});
