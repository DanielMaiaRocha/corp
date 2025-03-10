import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCorpFormByUser, registerCorpForm } from "../controllers/corp.controller.js";

const router = express.Router();

// Rota para cadastro do formulário
router.put("/cadastroDrops", protectRoute , registerCorpForm);
router.get("/cadastroDrops/", protectRoute , getCorpFormByUser);

export default router;