import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      required: [true, "Id is required!"],
      unique: [true, "Id already existed!"]
    },
    url: {
      type: String,
      default: "",
      required: [true, "Image url is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Image", ImageSchema);
