import mongoose, { Schema } from "mongoose";

const SiteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      unique: [true, "Id already existed!"]
    },
    phone: {
      type: String,
      default: ""
    },
    longitude: {
      type: String,
      default: ""
    },
    latitude: {
      type: String,
      default: ""
    },
    logo: {
      type: String,
      default: ""
    },
    fontTitle: {
      type: String,
      default: ""
    },
    fontBody: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    navItems: {
      type: Array,
      default: []
    },
    isPublish: Boolean,
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    homePageImageId: [{ type: Schema.Types.ObjectId, ref: "HomePageImage" }],
    themeId: { type: Schema.Types.ObjectId, ref: "Theme" }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Site", SiteSchema);
