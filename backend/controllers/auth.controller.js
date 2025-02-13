import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const acessToken = jwt.sign({ userId }, process.env.ACESS_TOKEN_SCT, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SCT, {
    expiresIn: "7d",
  });

  return { acessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  // Remove qualquer refreshToken antigo antes de armazenar um novo
  await redis.del(`refresh_token:${userId}`);
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
  console.log("Refresh token stored in Redis for user:", userId);
};

const setCookies = (res, acessToken, refreshToken) => {
  res.cookie("acessToken", acessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });

  console.log("Cookies set successfully");
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      console.log("No refresh token provided in cookies");
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SCT);
    } catch (error) {
      console.log("Invalid refresh token:", error.message);
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    
    if (!storedToken) {
      console.log("No refresh token found in Redis for user:", decoded.userId);
      return res.status(403).json({ message: "Refresh token not found" });
    }

    if (storedToken !== refreshToken) {
      console.log("Token mismatch: Received token does not match stored token in Redis");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Se todas as verificações passaram, gera um novo acessToken
    const acessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACESS_TOKEN_SCT,
      { expiresIn: "15m" }
    );

    console.log("Token refreshed successfully for user:", decoded.userId);

    res.cookie("acessToken", acessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
