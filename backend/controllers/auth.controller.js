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
    sameSite: "none",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });

  console.log("Cookies set successfully");
};

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    const { acessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, acessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { acessToken, refreshToken } = generateTokens(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, acessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SCT);
        await redis.del(`refresh_token:${decoded.userId}`);
        console.log("Refresh token removed from Redis for user:", decoded.userId);
      } catch (error) {
        console.log("Error verifying refresh token on logout:", error.message);
      }
    }

    res.clearCookie("acessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
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

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, password, phone, address, zipCode } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }
    if (password) user.password = password;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (zipCode) user.zipCode = zipCode;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        zipCode: user.zipCode,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
