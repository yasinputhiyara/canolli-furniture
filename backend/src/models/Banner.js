import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  image: String,
  link: String,
  isActive: Boolean
});

export default mongoose.model("Banner", bannerSchema);
