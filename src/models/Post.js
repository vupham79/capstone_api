import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: [true, "Id already existed!"]
    },
    title: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    },
    attachments: {
      media_type: String,
      images: [String],
      video: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdTime: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Post", PostSchema);
