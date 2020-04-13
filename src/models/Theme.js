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
      default: "Arial",
    },
    fontBody: {
      type: String,
      default: "Arial",
    },
    mainColor: {
      type: String,
      default: "#1474D4",
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
    isOnePage: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Theme", ThemeSchema);
