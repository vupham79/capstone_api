import mongoose from "mongoose";
import User from "./User";
import Theme from "./Theme";
import Image from "./Image";
import Post from "./Post";
import Site from "./Site";
import Video from "./Video";
import HomePageImage from "./HomePageImage";
import Category from "./Category";
require("dotenv").config();

const connectDb = () => {
  mongoose
    .connect(process.env.MONGODB_URL_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log("Connected to Database");
    })
    .catch(err => {
      console.log("Not Connected to Database ERROR! ", err);
    });
};

export {
  connectDb,
  User,
  Theme,
  Image,
  Post,
  Site,
  Video,
  HomePageImage,
  Category
};
