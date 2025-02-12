import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    createCheckoutSession,
    checkoutSuccess,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Rota para criar uma sessão de checkout (preferência de pagamento)
router.post("/create-mercado-pago-preference", protectRoute, createCheckoutSession);

// Rota para processar o sucesso do pagamento
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;