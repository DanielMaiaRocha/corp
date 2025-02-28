import express from "express";
import { addCarouselImage, deleteCarouselImage, getCarouselImages } from "../controllers/carousel.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCarouselImages);
router.post("/", protectRoute, adminRoute, addCarouselImage);
router.delete("/:id", protectRoute, adminRoute, deleteCarouselImage);

export default router;
