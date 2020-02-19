import mongoose from "mongoose";

const ColorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      required: [true, "Id is required!"]
    },
    color: {
      type: String,
      default: "",
      required: [true, "Color code is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("SuggestedColor", ColorSchema);
