import mongoose from "mongoose";

const SuggestedThemeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"]
    },
    name: {
      type: String,
      required: [true, "Name is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("SuggestedTheme", CategorySchema);
