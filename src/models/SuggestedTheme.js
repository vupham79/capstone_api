import mongoose from "mongoose";

const SuggestedThemeSchema = new mongoose.Schema(
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

export default mongoose.model("SuggestedTheme", SuggestedThemeSchema);
