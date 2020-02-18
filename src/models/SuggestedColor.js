import mongoose from "mongoose";

const ColorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"]
    },
    color: {
      type: String,
      required: [true, "Color code is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("SuggestedColor", ColorSchema);
