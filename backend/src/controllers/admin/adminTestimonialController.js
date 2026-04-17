import Testimonial from "../../models/Testimonial.js";
import asyncHandler from "../../utils/asyncHandler.js";
import cloudinary from "../../config/cloudinary.js";

const extractPublicId = (url) => {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const pathWithVersion = parts[1];
    const pathWithoutVersion = pathWithVersion.substring(pathWithVersion.indexOf("/") + 1);
    return pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
  } catch (e) {
    return null;
  }
};

// Admin: Create testimonial
export const createTestimonial = asyncHandler(async (req, res) => {
  const { name, rating, description, location, isActive, order } = req.body;

  if (!name || !rating || !description) {
    res.status(400);
    throw new Error("Name, rating and description are required");
  }

  let photoUrl = "";
  if (req.file) {
    const uploaded = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "canolli-testimonials" }
    );
    photoUrl = uploaded.secure_url;
  }

  const testimonial = await Testimonial.create({
    name,
    photo: photoUrl,
    rating: Number(rating),
    description,
    location: location || "",
    isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
    order: order ? Number(order) : 0
  });

  res.status(201).json({ message: "Testimonial created", testimonial });
});

// Admin: Get all testimonials
export const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });
  res.status(200).json(testimonials);
});

// Admin: Update testimonial
export const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, rating, description, location, isActive, order } = req.body;

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  if (name !== undefined) testimonial.name = name;
  if (rating !== undefined) testimonial.rating = Number(rating);
  if (description !== undefined) testimonial.description = description;
  if (location !== undefined) testimonial.location = location;
  if (isActive !== undefined) testimonial.isActive = isActive === "true" || isActive === true;
  if (order !== undefined) testimonial.order = Number(order);

  if (req.file) {
    if (testimonial.photo) {
      const publicId = extractPublicId(testimonial.photo);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }
    const uploaded = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "canolli-testimonials" }
    );
    testimonial.photo = uploaded.secure_url;
  }

  await testimonial.save();
  res.status(200).json({ message: "Testimonial updated", testimonial });
});

// Admin: Delete testimonial
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  if (testimonial.photo) {
    const publicId = extractPublicId(testimonial.photo);
    if (publicId) await cloudinary.uploader.destroy(publicId);
  }

  await Testimonial.deleteOne({ _id: id });
  res.status(200).json({ message: "Testimonial deleted" });
});

// Public: Get active testimonials
export const getPublicTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  res.status(200).json(testimonials);
});
