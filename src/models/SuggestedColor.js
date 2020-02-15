import mongoose from "mongoose";

const ColorSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Id is required!"],
      unique: true
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
