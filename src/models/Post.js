import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"],
      unique: [true, "Id already existed!"]
    },
    content: {
      type: String,
      required: [true, "Content is required!"]
    },
    videoId: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    imageId: [{ type: Schema.Types.ObjectId, ref: "Image" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Post", PostSchema);
