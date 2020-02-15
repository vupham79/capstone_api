import mongoose, { Schema } from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Id is required!"],
      unique: true
    },
    name: {
      type: String,
      required: [true, "Theme name is required!"]
    },
    suggested_font: {
      type: String,
      required: [true, "Suggested font is required!"]
    },
    code: {
      type: String,
      required: [true, "Color code is required!"]
    },
    suggestedColorId: [{ type: Schema.Types.ObjectId, ref: "SuggestedColor" }],
    siteId: [{ type: Schema.Types.ObjectId, ref: "Site" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Theme", ThemeSchema);
