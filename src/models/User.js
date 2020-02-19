import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      required: [true, "Id is required!"]
    },
    picture: {
      type: String,
      default: ""
    },
    displayName: {
      type: String,
      default: "",
      required: [true, "Display name is required!"]
    },
    email: {
      type: String,
      default: "",
      required: [true, "Email is required!"]
    },
    accessToken: {
      type: String,
      default: "",
      required: [true, "Access token is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema);
