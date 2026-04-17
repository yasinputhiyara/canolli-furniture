import Faq from "../../models/Faq.js";
import asyncHandler from "../../utils/asyncHandler.js";

// Admin: Create FAQ
export const createFaq = asyncHandler(async (req, res) => {
  const { question, answer, isActive, order } = req.body;

  if (!question || !answer) {
    res.status(400);
    throw new Error("Question and answer are required");
  }

  const faq = await Faq.create({
    question,
    answer,
    isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
    order: order ? Number(order) : 0
  });

  res.status(201).json({ message: "FAQ created", faq });
});

// Admin: Get all FAQs
export const getAllFaqs = asyncHandler(async (req, res) => {
  const faqs = await Faq.find({}).sort({ order: 1, createdAt: -1 });
  res.status(200).json(faqs);
});

// Admin: Update FAQ
export const updateFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { question, answer, isActive, order } = req.body;

  const faq = await Faq.findById(id);
  if (!faq) {
    res.status(404);
    throw new Error("FAQ not found");
  }

  if (question !== undefined) faq.question = question;
  if (answer !== undefined) faq.answer = answer;
  if (isActive !== undefined) faq.isActive = isActive === "true" || isActive === true;
  if (order !== undefined) faq.order = Number(order);

  await faq.save();
  res.status(200).json({ message: "FAQ updated", faq });
});

// Admin: Delete FAQ
export const deleteFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const faq = await Faq.findById(id);
  if (!faq) {
    res.status(404);
    throw new Error("FAQ not found");
  }

  await Faq.deleteOne({ _id: id });
  res.status(200).json({ message: "FAQ deleted" });
});

// Public: Get active FAQs
export const getPublicFaqs = asyncHandler(async (req, res) => {
  const faqs = await Faq.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  res.status(200).json(faqs);
});
