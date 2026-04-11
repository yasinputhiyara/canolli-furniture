import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import errorHandler from "./src/middleware/errorMiddleware.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRouters.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import passport from "./src/config/passport.js";

dotenv.config();

const app = express();
app.use(passport.initialize());
const PORT = process.env.PORT || 4000;

// connect DB
connectDB();

// parse JSON
app.use(express.json());

// cors
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1/admin", adminRoutes);

// global error handler 
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
