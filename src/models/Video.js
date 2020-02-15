import mongoose, { Schema } from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Id is required!"],
      unique: true
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
