import mongoose, { Schema } from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Category already existed!"],
    },
    picture: {
      type: String,
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

export default mongoose.model("Category", CategorySchema);
