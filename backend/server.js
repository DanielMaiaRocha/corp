import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import corpRoutes from "./routes/corp.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import carouselRoutes from "./routes/carousel.routes.js";

dotenv.config();

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5500;


app.use(cors({
    origin: process.env.FRONTEND_URL || "https://corp-front-production.up.railway.app",
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/drops", corpRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/carousel", carouselRoutes);

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
    connectDB();
});
