import mongoose from "mongoose";
import User from "./User";
import Theme from "./Theme";
import NavItem from "./NavItem";
import Image from "./Image";
import Post from "./Post";
import Site from "./Site";
import SuggestedColor from "./SuggestedColor";
import Video from "./Video";
import HomePageImage from "./HomePageImage";
require("dotenv").config();

const connectDb = () => {
  mongoose
    .connect(process.env.MONGODB_URL_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true
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
  NavItem,
  Image,
  Post,
  Site,
  SuggestedColor,
  Video,
  HomePageImage
};
