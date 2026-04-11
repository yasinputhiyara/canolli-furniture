import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../models/User.js";

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" })
    .select("-password")
    .sort({ createdAt: -1 });
    
  res.status(200).json(users);
});
