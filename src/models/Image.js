import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Id is required!"],
      unique: true
    },
    url: {
      type: String,
      required: [true, "Image url is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Image", ImageSchema);
