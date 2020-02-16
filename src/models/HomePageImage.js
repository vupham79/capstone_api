import mongoose from "mongoose";

const HomePageImageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"],
      unique: [true, "Id already existed!"]
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
