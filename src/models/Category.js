import mongoose, { Schema } from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      required: [true, "Id is required!"]
    },
    name: {
      type: String,
      default: "",
      required: [true, "Name is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Category", CategorySchema);
