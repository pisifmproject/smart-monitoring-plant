// src/auth/auth.controller.ts
import express from "express";
import { loginUser, verifyToken } from "./auth.service";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Attempt login
    const result = await loginUser(username, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Success
    res.json(result);
  } catch (error) {
    console.error("Login controller error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/auth/me - Get current user info from token
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    res.json({
      success: true,
      user: decoded,
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
