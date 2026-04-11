import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      default: ""
    },
    bannerImage: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Auto-generate slug
categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

export default mongoose.model("Category", categorySchema);