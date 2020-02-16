import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"],
      unique: [true, "Id already existed!"]
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
