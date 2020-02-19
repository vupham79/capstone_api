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
    category: {
      type: String,
      default: "",
      required: [true, "Category is required!"]
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
    isActivated: Boolean,
    postId: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    userId: [{ type: Schema.Types.ObjectId, ref: "User" }],
    navItemId: [{ type: Schema.Types.ObjectId, ref: "NavItem" }],
    homePageImageId: [{ type: Schema.Types.ObjectId, ref: "HomePageImage" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Site", SiteSchema);
