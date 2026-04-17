import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    photo: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
