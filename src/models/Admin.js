import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already existed!"]
    },
    password: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Admin", AdminSchema);
