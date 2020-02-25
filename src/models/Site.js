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
    color: {
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
    color: {
      type: String,
      default: ""
    },
    navItems: [
      {
        name: {
          type: String,
          required: true
        },
        order: {
          type: Number,
          required: true
        },
        isActive: {
          type: Boolean,
          default: true
        }
      }
    ],
    isPublish: Boolean,
    posts: [
      {
        id: {
          type: String,
          default: ""
        },
        title: String,
        message: String,
        attachments: {
          media_type: String,
          images: [String],
          video: String
        }
      }
    ],
    cover: [{ type: String, default: "" }],
    categories: [
      {
        id: {
          type: String,
          default: ""
        },
        name: {
          type: String,
          default: ""
        }
      }
    ],
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    themeId: { type: Schema.Types.ObjectId, ref: "Theme" }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Site", SiteSchema);
