import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: String,
    displayName: String,
    email: String,
    accessToken: String,
    picture: String
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema);
