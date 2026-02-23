import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    slug: {
      type: String,
      unique: true
    },
    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    price: Number,
    discountPrice: Number,
    stock: Number,
    sku: String,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    material: String,
    images: [String],
    videos: [String],
    ratings: {
      average: Number,
      count: Number
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        name: String,
        rating: Number,
        comment: String,
        createdAt: Date
      }
    ],
    isFeatured: Boolean,
    isActive: Boolean
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
