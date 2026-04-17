import express from "express";
import { getAllProducts, getProductById } from "../controllers/user/productController.js";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/user/cartController.js";
import { getUserProfile, addAddress } from "../controllers/user/profileController.js";
import { createOrder, getUserOrders, cancelUserOrder } from "../controllers/user/orderController.js";
import { getAllCategories } from "../controllers/user/categoryController.js";
import { getProductReviews, addProductReview, deleteProductReview } from "../controllers/user/reviewController.js";
import { getPublicTestimonials } from "../controllers/admin/adminTestimonialController.js";
import { getPublicFaqs } from "../controllers/admin/adminFaqController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Product routes (public)
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

// Review routes
router.get("/products/:id/reviews", getProductReviews);
router.post("/products/:id/reviews", protect, addProductReview);
router.delete("/products/:id/reviews/:reviewId", protect, deleteProductReview);

// Category routes (public)
router.get("/categories", getAllCategories);

// Testimonials (public)
router.get("/testimonials", getPublicTestimonials);

// Cart routes (protected)
router.get("/cart", protect, getCart);
router.post("/cart", protect, addToCart);
router.put("/cart/:productId", protect, updateCartItem);
router.delete("/cart/:productId", protect, removeFromCart);
router.delete("/cart", protect, clearCart);

// User Profile & Address routes (protected)
router.get("/profile", protect, getUserProfile);
router.post("/address", protect, addAddress);

// Order routes (protected)
router.get("/orders", protect, getUserOrders);
router.post("/orders", protect, createOrder);
router.put("/orders/:id/cancel", protect, cancelUserOrder);

// Public Testimonial & FAQ Routes
router.get("/testimonials", getPublicTestimonials);
router.get("/faqs", getPublicFaqs);

export default router;
