import mongoose, { Schema } from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: [true, "Id already existed!"]
    },
    name: {
      type: String,
      default: null
    },
    fontTitle: {
      type: String,
      default: null
    },
    fontBody: {
      type: String,
      default: null
    },
    mainColor: {
      type: String,
      default: null
    },
    previewImage: {
      type: String,
      default: null
    },
    previewUrl: {
      type: String,
      default: null
    },
    backgroundImages: [
      {
        type: String
      }
    ],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Theme", ThemeSchema);
