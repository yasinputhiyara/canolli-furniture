import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import errorHandler from "./src/middleware/errorMiddleware.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRouters.js";
import adminRoutes from "./src/routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// connect DB
connectDB();

// parse JSON
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1/admin", adminRoutes);

// global error handler 
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
