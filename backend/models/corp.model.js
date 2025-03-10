import mongoose from "mongoose";

const corpFormSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referência ao modelo User
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      enum: ["Masculino", "Feminino"],
      required: true,
    },
    size: {
      type: [String],
      enum: ["PP", "P", "M", "G", "GG"],
      required: true,
    },
    corpRec: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const CorpForm = mongoose.model("CorpForm", corpFormSchema);

export default CorpForm;