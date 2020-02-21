import mongoose, { Schema } from "mongoose";

const SiteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      required: [true, "Id is required!"],
      unique: [true, "Id already existed!"]
    },
    phone: {
      type: String,
      default: "",
      required: [true, "Phone number required"]
    },
    longitude: {
      type: String,
      default: "",
      required: [true, "Longitude is required!"]
    },
    latitude: {
      type: String,
      default: "",
      required: [true, "Latitude is required!"]
    },
    logo: {
      type: String,
      default: "",
      required: [true, "Logo is required!"]
    },
    fontTitle: {
      type: String,
      default: "",
      required: [true, "Font title is required!"]
    },
    fontBody: {
      type: String,
      default: "",
      required: [true, "Font body is required!"]
    },
    title: {
      type: String,
      default: "",
      required: [true, "Title is required!"]
    },
    address: {
      type: String,
      default: "",
      required: false
    },
    navItems: {
      type: Array,
      default: [],
      required: [true, "Navigation item is required!"]
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
