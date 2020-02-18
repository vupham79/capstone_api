import mongoose, { Schema } from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"]
    },
    url: {
      type: String,
      required: [true, "Video url is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Video", VideoSchema);
