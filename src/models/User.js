import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: ""
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
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema);
