import mongoose from "mongoose";

const HomePageImageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"]
    },
    url: {
      type: String,
      required: [true, "Home page url is required!"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("HomePageImage", HomePageImageSchema);
