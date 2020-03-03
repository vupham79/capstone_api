import mongoose, { Schema } from "mongoose";

const SiteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: [true, "Id already existed!"]
    },
    phone: {
      type: String,
      default: null
    },
    longitude: {
      type: String,
      default: null
    },
    latitude: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    },
    logo: {
      type: String,
      default: null
    },
    fontTitle: {
      type: String,
      default: null
    },
    fontBody: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    address: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
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
    isPublish: {
      type: Boolean,
      default: false
    },
    cover: [{ type: String, default: null }],
    categories: [
      {
        id: {
          type: String,
          default: null
        },
        name: {
          type: String,
          default: null
        }
      }
    ],
    url: {
      type: String,
      default: null
    },
    sitePath: {
      type: String,
      default: null
    },
    about: {
      type: String,
      default: null
    },
    genre: {
      type: String,
      default: null
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    theme: { type: Schema.Types.ObjectId, ref: "Theme" }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Site", SiteSchema);
