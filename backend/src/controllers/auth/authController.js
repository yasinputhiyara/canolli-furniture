import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToen.js";



export const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;

  // check required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  // check user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  if (user) {
    res.status(201).json({
      message: "User registered successfully"
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }

});

export const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  res.status(200).json({
    message: "Login successful",
    token: generateToken(user._id, user.role)
  });

});
