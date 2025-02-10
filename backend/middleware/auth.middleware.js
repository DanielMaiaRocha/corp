import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Verifica se o acessToken está presente nos cookies
    const acessToken = req.cookies.acessToken; 

    if (!acessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    // Tenta decodificar o acessToken
    let decoded;
    try {
      decoded = jwt.verify(acessToken, process.env.ACESS_TOKEN_SCT); 
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Se o token expirou, tenta renová-lo usando o refreshToken
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          return res
            .status(401)
            .json({ message: "Unauthorized - Token expired and no refresh token provided" });
        }

        // Verifica e decodifica o refreshToken
        const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SCT);

        // Busca o usuário no banco de dados
        const user = await User.findById(refreshDecoded.userId).select("-password");

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Gera um novo acessToken
        const newAcessToken = jwt.sign(
          { userId: user._id },
          process.env.ACESS_TOKEN_SCT, 
          { expiresIn: "15m" } // Define um tempo de expiração para o novo token
        );

        // Define o novo acessToken nos cookies
        res.cookie("acessToken", newAcessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        // Adiciona o usuário à requisição
        req.user = user;
        return next();
      } else {
        // Outros erros de token (inválido, malformado, etc.)
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }
    }

    // Verifica se o token decodificado contém o userId
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Busca o usuário no banco de dados
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Adiciona o usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute Middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Token invalid" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied - Admin only" });
  }
};