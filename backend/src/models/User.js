import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  pincode: String,
  state: String,
  city: String,
  house: String,
  area: String,
  landmark: String,
  isDefault: Boolean
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phone: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    addresses: [addressSchema]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
