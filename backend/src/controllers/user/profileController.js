import User from "../../models/User.js";

// @desc    Get user profile and addresses
// @route   GET /api/v1/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new address to user profile
// @route   POST /api/v1/user/address
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { fullName, phone, pincode, state, city, house, area, landmark, isDefault } = req.body;

    const newAddress = {
      fullName,
      phone,
      pincode,
      state,
      city,
      house,
      area,
      landmark,
      isDefault: isDefault || false
    };

    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ message: "Address added", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
