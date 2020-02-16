import mongoose from "mongoose";
import { HomePageImage } from "../models";
require("dotenv").config();

export async function createHomePageImage() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await HomePageImage.create([
    {
      id: "1",
      url: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg"
    },
    {
      id: "2",
      url: "https://i.ibb.co/0qXLK9v/transparent-piano.jpg"
    },
    {
      id: "3",
      url: "https://i.ibb.co/KDkDJyk/piano-icon-30.jpg"
    }
  ]);
  return await HomePageImage.find();
}

export async function insertHomePageImage(id, body) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await HomePageImage.collection.insertOne({
    id: id,
    url: body.url
  });
  return await HomePageImage.find();
}

export async function editHomePageImage(id, body) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const HomePageImageResult = await HomePageImage.findOne({ id: id });
  await HomePageImageResult.updateOne({
    url: body.url
  });
  return await HomePageImage.find();
}

export async function findAllHomePageImage() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await HomePageImage.find();
}

export async function findOneHomePageImage(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await HomePageImage.findOne({ id: id });
}
