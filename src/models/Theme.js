import mongoose, { Schema } from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      required: [true, "Id is required!"]
    },
    name: {
      type: String,
      default: "",
      required: [true, "Theme name is required!"]
    },
    suggested_font: {
      type: String,
      default: "",
      required: [true, "Suggested font is required!"]
    },
    suggestedColorId: [{ type: Schema.Types.ObjectId, ref: "SuggestedColor" }],
    siteId: [{ type: Schema.Types.ObjectId, ref: "Site" }],
    suggestedThemeId: [{ type: Schema.Types.ObjectId, ref: "SuggestedTheme" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Theme", ThemeSchema);
