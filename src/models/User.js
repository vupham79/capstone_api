import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"]
    },
    picture: {
      type: String
    },
    displayName: {
      type: String,
      required: [true, "Display name is required!"]
    },
    email: {
      type: String,
      required: [true, "Email is required!"]
    },
    accessToken: {
      type: String,
      required: [true, "Access token is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema);
