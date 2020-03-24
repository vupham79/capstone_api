import mongoose from "mongoose";

const SyncRecordScheme = new mongoose.Schema(
  {
    dataType: {
      type: String,
      enum: ["All", "News", "Event", "Gallery"],
      required: true
    },
    dateFrom: {
      type: Date,
      default: null
    },
    dateTo: {
      type: Date,
      default: null
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("SyncRecord", SyncRecordScheme);
