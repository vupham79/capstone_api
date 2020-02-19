import mongoose from "mongoose";

const NavItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      required: [true, "Id is required!"]
    },
    order: {
      type: Number,
      default: 0,
      required: [true, "Order is required!"]
    },
    title: {
      type: String,
      default: "",
      required: [true, "Title is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("NavItem", NavItemSchema);
