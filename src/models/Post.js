import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      unique: [true, "Id already existed!"]
    },
    content: {
      type: String,
      default: ""
    },
    videoId: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    imageId: [{ type: Schema.Types.ObjectId, ref: "Image" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Post", PostSchema);
