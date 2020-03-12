import mongoose from "mongoose";
import Site from "./Site";
import Theme from "./Theme";
import User from "./User";
import Admin from "./Admin";
import Post from "./Post";
import Event from "./Event";
import Category from "./Category";
require("dotenv").config();

const connectDb = () => {
  mongoose
    .connect(process.env.MONGODB_URL_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      numberOfRetries: 0
    })
    .then(() => {
      console.log("Connected to Database");
    })
    .catch(err => {
      console.log("Not Connected to Database ERROR! ", err);
    });
};

export { connectDb, User, Theme, Site, Admin, Post, Event, mongoose };
