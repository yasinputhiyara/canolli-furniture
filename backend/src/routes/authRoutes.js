import express from "express";
import passport from "passport";
import { loginUser, registerUser, adminLogin } from "../controllers/auth/authController.js";
import generateToken from "../utils/generateToen.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", adminLogin);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`, session: false }),
  (req, res) => {
    // Successful authentication, issue token and redirect.
    if (!req.user) return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=auth_failed`);
    const token = generateToken(req.user._id, req.user.role);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?token=${token}&name=${encodeURIComponent(req.user.name)}`);
  }
);

export default router;
