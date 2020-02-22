import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
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

export default mongoose.model("Video", VideoSchema);
