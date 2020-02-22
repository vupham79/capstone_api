import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Category", CategorySchema);
