import mongoose, { Schema } from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      required: [true, "Id is required!"]
    },
    url: {
      type: String,
      default: "",
      required: [true, "Video url is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Video", VideoSchema);
