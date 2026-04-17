import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { addProduct, getAllProducts, deleteProduct, updateProduct } from "../controllers/admin/adminProductController.js";
import { 
  addCategory, 
  getAllAdminCategories, 
  updateCategory, 
  deleteCategory 
} from "../controllers/admin/adminCategoryController.js";
import { getAllUsers } from "../controllers/admin/adminUserController.js";
import { getDashboardStats } from "../controllers/admin/adminDashboardController.js";
import { getAllOrders, updateOrderStatus } from "../controllers/admin/adminOrderController.js";
import {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial
} from "../controllers/admin/adminTestimonialController.js";
import {
  createFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq
} from "../controllers/admin/adminFaqController.js";

const router = express.Router();

router.post(
  "/products",
  protect,
  adminOnly,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 }
  ]),
  addProduct
);
router.get("/products", protect, adminOnly, getAllProducts);
router.delete("/products/:id", protect, adminOnly, deleteProduct);
router.put(
  "/products/:id",
  protect,
  adminOnly,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 }
  ]),
  updateProduct
);

// Category Routes
router.post("/categories", protect, adminOnly, upload.single("bannerImage"), addCategory);
router.get("/categories", protect, adminOnly, getAllAdminCategories);
router.put("/categories/:id", protect, adminOnly, upload.single("bannerImage"), updateCategory);
router.delete("/categories/:id", protect, adminOnly, deleteCategory);

router.get("/users", protect, adminOnly, getAllUsers);
router.get("/stats", protect, adminOnly, getDashboardStats);

router.get("/orders", protect, adminOnly, getAllOrders);
router.put("/orders/:id/status", protect, adminOnly, updateOrderStatus);

// Testimonial routes
router.get("/testimonials", protect, adminOnly, getAllTestimonials);
router.post("/testimonials", protect, adminOnly, upload.single("photo"), createTestimonial);
router.put("/testimonials/:id", protect, adminOnly, upload.single("photo"), updateTestimonial);
router.delete("/testimonials/:id", protect, adminOnly, deleteTestimonial);

// FAQ routes
router.get("/faqs", protect, adminOnly, getAllFaqs);
router.post("/faqs", protect, adminOnly, createFaq);
router.put("/faqs/:id", protect, adminOnly, updateFaq);
router.delete("/faqs/:id", protect, adminOnly, deleteFaq);

export default router;