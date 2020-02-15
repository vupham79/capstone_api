import mongoose from "mongoose";

const NavItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Id is required!"],
      unique: true
    },
    order: String,
    title: {
      type: String,
      required: [true, "Title is required!"]
    },
    url: {
      type: String,
      required: [true, "Navigation item url is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("NavItem", NavItemSchema);
