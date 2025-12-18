// src/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByUsername } from "./auth.repository";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const JWT_EXPIRES_IN = "7d";

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    name: string;
    role: string;
    plantAccess: string[];
  };
  token?: string;
}

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    username = String(username ?? "").trim();
    password = String(password ?? "").trim();

    const user = await findUserByUsername(username);

    if (!user) {
      return {
        success: false,
        message:
          "Invalid credentials provided. Please contact your system administrator.",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message:
          "Account is deactivated. Please contact your system administrator.",
      };
    }

    // Guard: if hash missing, treat as invalid (avoid weird true/false)
    if (!user.passwordHash) {
      return {
        success: false,
        message:
          "Invalid credentials provided. Please contact your system administrator.",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        message:
          "Invalid credentials provided. Please contact your system administrator.",
      };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        plantAccess: user.plantAccess,
      },
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};
