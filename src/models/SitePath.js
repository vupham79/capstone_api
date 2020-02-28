import mongoose from "mongoose";

const SitePathSchema = new mongoose.Schema(
  {
    pathName: {
      type: String,
      required: true,
      unique: [true, "Path name already existed!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("SitePath", SitePathSchema);
