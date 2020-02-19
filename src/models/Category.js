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
    },
    suggestedThemeId: [{ type: Schema.Types.ObjectId, ref: "SuggestedTheme" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Category", CategorySchema);
