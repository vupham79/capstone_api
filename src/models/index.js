import mongoose from "mongoose";
import Category from "./Category";
import HomePageImage from "./HomePageImage";
import Image from "./Image";
import Post from "./Post";
import Site from "./Site";
import Theme from "./Theme";
import User from "./User";
import Video from "./Video";
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
  Category,
  mongoose
};
