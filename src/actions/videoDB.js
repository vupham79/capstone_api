import mongoose from "mongoose";
import { Video } from "../models";
require("dotenv").config();

export async function createVideo() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await Video.create([
    {
      id: "1",
      url: "https://www.youtube.com/watch?v=4Tr0otuiQuU"
    },
    {
      id: "2",
      url: "https://www.youtube.com/watch?v=W-fFHeTX70Q"
    },
    {
      id: "3",
      url: "https://www.youtube.com/watch?v=t3217H8JppI"
    }
  ]);
  return await Video.find();
}

export async function insertVideo(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await Video.collection.insertOne({
    id: id,
    url: "https://www.youtube.com/watch?v=W-fFHeTX70Q"
  });
  return await Video.find();
}

export async function editVideo(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const VideoResult = await Video.findOne({ id: id });
  await VideoResult.updateOne({
    url: "https://www.youtube.com/watch?v=t3217H8JppI"
  });
  return await Video.find();
}

export async function findAllVideo() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await Video.find();
}

export async function findOneVideo(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await Video.findOne({ id: id });
}
