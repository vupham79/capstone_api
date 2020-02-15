import mongoose from "mongoose";

const HomePageImageSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Id is required!"],
      unique: true
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
