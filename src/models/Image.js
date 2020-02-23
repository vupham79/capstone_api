import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Image", ImageSchema);
