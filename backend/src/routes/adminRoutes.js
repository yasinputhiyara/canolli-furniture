import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { addProduct } from "../controllers/admin/adminProductController.js";
import { addCategory } from "../controllers/admin/adminCategoryController.js";

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
router.post("/categories", protect, adminOnly, addCategory);

export default router;