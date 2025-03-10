import express from "express"
import { login, logout, signup, refreshToken, getProfile, updateProfile, CorpFormRegister, getAllUsers } from "../controllers/auth.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/refresh-token", refreshToken)
router.get("/profile", protectRoute ,getProfile)
router.put("/profile", protectRoute ,updateProfile)
router.post("/profile/cadastroDrops", protectRoute , CorpFormRegister)
router.get("/", protectRoute, adminRoute , getAllUsers)

export default router