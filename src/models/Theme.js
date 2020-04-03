import mongoose, { Schema } from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
      unique: [true, "Name is already existed!"],
    },
    fontTitle: {
      type: String,
      default: null,
    },
    fontBody: {
      type: String,
      default: null,
    },
    mainColor: {
      type: String,
      default: null,
    },
    previewImage: {
      type: String,
      default: null,
    },
    sections: [
      {
        type: String,
        enum: ["news", "about", "gallery", "event", "contact"],
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Theme", ThemeSchema);
