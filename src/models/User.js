import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"],
      unique: [true, "Id already existed!"]
    },
    picture: {
      type: String
    },
    displayName: {
      type: String
    },
    email: {
      type: String
    },
    accessToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema);
