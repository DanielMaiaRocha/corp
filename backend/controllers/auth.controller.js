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
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7 days
};

const setCookies = (res, acessToken, refreshToken) => {
  res.cookie("acessToken", acessToken, {
    httpOnly: true, // prevencao contra XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevencao contra CSRF
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevencao contra XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevencao contra CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 15 min
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
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
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SCT);
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("acessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SCT);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh Token" });
    }

    const acessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACESS_TOKEN_SCT,
      { expiresIn: "15m" }
    );

    res.cookie("acesstoken", acessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
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
    const userId = req.user._id; // Obtém o ID do usuário autenticado
    const { name, email, password, phone, address, zipCode } = req.body;

    // Verifica se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Atualiza os campos se forem fornecidos
    if (name) user.name = name;
    if (email) {
      // Verifica se o novo email já está em uso por outro usuário
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }
    if (password) {
      user.password = password; // O middleware de hash será ativado antes do save()
    }
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (zipCode) user.zipCode = zipCode;

    // Salva as alterações no banco de dados
    await user.save();

    // Retorna a resposta sem informações sensíveis
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
    console.error("Error in updateProfile controller:", error.message); // Log de erro detalhado
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
