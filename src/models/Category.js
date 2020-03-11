import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: null,
      unique: [true, "Username already existed!"]
    },
    name: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Category", CategorySchema);
