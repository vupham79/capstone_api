import mongoose from "mongoose";

const SuggestedThemeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"],
      unique: [true, "Id already existed!"]
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
