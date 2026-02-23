import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number
      }
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      pincode: String,
      state: String,
      city: String,
      house: String,
      area: String,
      landmark: String
    },
    paymentMethod: {
      type: String,
      default: "COD"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
      default: "placed"
    },
    totalAmount: Number,
    isCancelled: Boolean,
    cancelledAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
