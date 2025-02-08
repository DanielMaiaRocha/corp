import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    image: { 
        type: [String],
        required: [true, 'At least one image is required']
    },
    category: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    size: { 
        type: [String],
        enum: ["PP", "P", "M", "G", "GG"], 
        required: [true, 'At least one size is required']
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;