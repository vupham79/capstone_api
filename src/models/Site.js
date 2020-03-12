import mongoose, { Schema, Mongoose } from "mongoose";

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
      required: true
    },
    sitePath: {
      type: String,
      required: true
    },
    about: {
      type: String,
      default: null
    },
    galleries: [
      {
        url: {
          type: String,
          default: null
        },
        target: {
          type: String,
          default: null
        }
      }
    ],
    lastSync: {
      type: Date,
      default: null
    },
    whatsapp: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    instagram: {
      type: String,
      default: null
    },
    youtube: {
      type: String,
      default: null
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    theme: { type: Schema.Types.ObjectId, ref: "Theme" },
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Site", SiteSchema);
