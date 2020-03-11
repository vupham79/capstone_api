import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: [true, "Id already existed!"]
    },
    picture: {
      type: String,
      default: null
    },
    displayName: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    isActivated: {
      type: Boolean,
      default: true
    },
    isAdmin: {
      type: Boolean,
      default: true
    },
    sites: [{ type: Schema.Types.ObjectId, ref: "Site" }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema);
