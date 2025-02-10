import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    mainImage: { 
        type: String,
        required: true,
    },
    images: { 
        type: [String],
        default: [],
    },
    category: {
        type: String,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    size: {
        type: [String],
        enum: ["PP", "P", "M", "G", "GG"],
        required: true,
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;