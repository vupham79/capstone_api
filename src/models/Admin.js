import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: "",
      unique: [true, "Username already existed!"]
    },
    password: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Admin", AdminSchema);
