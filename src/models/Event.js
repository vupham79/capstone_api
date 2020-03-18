import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: [true, "Id already existed!"]
    },
    name: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    cover: {
      type: String,
      default: null
    },
    startTime: {
      type: String,
      default: null
    },
    endTime: {
      type: String,
      default: null
    },
    place: {
      name: { type: String, default: null },
      street: { type: String, default: null },
      city: { type: String, default: null },
      country: { type: String, default: null }
    },
    url: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Event", EventSchema);
