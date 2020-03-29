import mongoose, { Schema } from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Category already existed!"]
    },
    picture: {
      type: String,
      required: true
    },
    themes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Theme"
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Category", CategorySchema);
