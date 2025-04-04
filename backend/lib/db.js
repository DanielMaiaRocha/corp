import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
       const conn = await mongoose.connect(process.env.MONGO_URL)
       console.log(`DB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error to connect", error.message);
        process.exit(1);
    }
}