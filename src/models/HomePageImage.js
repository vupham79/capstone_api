import mongoose from "mongoose";

const HomePageImageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      required: [true, "Id is required!"]
    },
    url: {
      type: String,
      default: "",
      required: [true, "Home page url is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("HomePageImage", HomePageImageSchema);
