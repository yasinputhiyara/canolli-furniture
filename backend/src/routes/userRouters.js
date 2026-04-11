import express from "express";
import { getAllProducts, getProductById } from "../controllers/user/productController.js";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/user/cartController.js";
import { getUserProfile, addAddress } from "../controllers/user/profileController.js";
import { createOrder, getUserOrders, cancelUserOrder } from "../controllers/user/orderController.js";
import { getAllCategories } from "../controllers/user/categoryController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Product routes (public)
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

// Category routes (public)
router.get("/categories", getAllCategories);

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

export default router;
