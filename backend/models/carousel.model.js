import mongoose from "mongoose";

const CarouselSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Carousel = mongoose.model("Carousel", CarouselSchema);
export default Carousel;
