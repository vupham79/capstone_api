import mongoose, { Schema, Mongoose } from "mongoose";

const SiteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: [true, "Id already existed!"],
    },
    phone: {
      type: String,
      default: null,
    },
    longitude: {
      type: String,
      default: null,
    },
    latitude: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    fontTitle: {
      type: String,
      default: null,
    },
    fontBody: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
      maxlength: 75,
    },
    address: {
      type: String,
      default: null,
    },
    navItems: [
      {
        name: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        original: {
          type: String,
          required: true,
        },
      },
    ],
    isPublish: {
      type: Boolean,
      default: false,
    },
    cover: [{ type: String, default: null }],
    categories: [
      {
        id: {
          type: String,
          default: null,
        },
        name: {
          type: String,
          default: null,
        },
      },
    ],
    url: {
      type: String,
      required: true,
    },
    sitePath: {
      type: String,
      required: true,
      unique: true,
      maxlength: 35,
    },
    about: {
      type: String,
      default: null,
    },
    galleries: [
      {
        url: {
          type: String,
        },
        target: {
          type: String,
        },
        createdTime: {
          type: String,
        },
      },
    ],
    syncRecords: [{ type: Schema.Types.ObjectId, ref: "SyncRecord" }],
    whatsapp: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    instagram: {
      type: String,
      default: null,
    },
    youtube: {
      type: String,
      default: null,
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    theme: { type: Schema.Types.ObjectId, ref: "Theme" },
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    homepage: [
      {
        name: {
          type: String,
          required: true,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
        original: {
          type: String,
        },
        order: {
          type: Number,
          required: true,
        },
        filter: {
          type: {
            type: String,
            enum: ["latest", "manual"],
          },
          items: [
            {
              type: String,
            },
          ],
        },
      },
    ],
    autoSync: {
      dataType: {
        type: String,
        default: "none",
      },
      minute: {
        type: Number,
      },
      hour: {
        type: Number,
      },
      day: {
        type: Number,
      },
    },
    showDesEvent: {
      type: Boolean,
      default: true,
    },
    showPlaceEvent: {
      type: Boolean,
      default: true,
    },
    showCoverEvent: {
      type: Boolean,
      default: true,
    },
    story: {
      id: {
        type: String,
      },
      picture: {
        type: String,
      },
      title: {
        type: String,
      },
      composedText: [
        {
          type: String,
        },
      ],
    },
    limitNews: {
      type: Number,
      default: 3,
    },
    limitGallery: {
      type: Number,
      default: 3,
    },
    limitEvent: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Site", SiteSchema);
