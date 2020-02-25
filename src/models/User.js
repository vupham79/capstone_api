import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      unique: [true, "Id already existed!"]
    },
    picture: {
      type: String,
      default: ""
    },
    displayName: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    accessToken: {
      type: String,
      default: ""
    },
    isActivated: {
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
