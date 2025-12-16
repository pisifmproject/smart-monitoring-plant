// src/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByUsername, User } from "./auth.repository";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
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
    // Find user in database
    const user = await findUserByUsername(username);

    if (!user) {
      return {
        success: false,
        message:
          "Invalid credentials provided. Please contact your system administrator.",
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        message:
          "Account is deactivated. Please contact your system administrator.",
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        message:
          "Invalid credentials provided. Please contact your system administrator.",
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return success with user data (without password hash)
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
  } catch (error) {
    return null;
  }
};
