import express from "express";
import { getAllProducts } from "../controllers/user/productController.js";

const router = express.Router();

router.get("/products", getAllProducts);

export default router;
