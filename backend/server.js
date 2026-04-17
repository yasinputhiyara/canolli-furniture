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
// const allowedOrigins = [
//   process.env.CLIENT_URL || "http://localhost:5173",
//   "http://localhost:5173",
//   "http://localhost:4173",
// ];
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:4173"
];
app.use(cors({
  origin: (origin, callback) => {
    // if (!origin || allowedOrigins.includes(origin)) {
    //   callback(null, true);
    // } else {
    //   callback(new Error("Not allowed by CORS"));
    // }
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("Blocked by CORS:", origin);
      callback(null, false); // don't throw error
    }
  },
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
