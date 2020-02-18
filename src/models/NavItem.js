import mongoose from "mongoose";

const NavItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"]
    },
    order: {
      type: Number,
      required: [true, "Order is required!"],
      unique: true
    },
    title: {
      type: String,
      required: [true, "Title is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("NavItem", NavItemSchema);
