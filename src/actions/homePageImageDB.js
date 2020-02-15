import mongoose from "mongoose";
import { HomePageImage } from "../models";
require("dotenv").config();

export async function createHomePageImage() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await HomePageImage.create([
    {
      id: 1,
      url: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg"
    },
    {
      id: 2,
      url: "https://i.ibb.co/0qXLK9v/transparent-piano.jpg"
    },
    {
      id: 3,
      url: "https://i.ibb.co/KDkDJyk/piano-icon-30.jpg"
    }
  ]);
  return await HomePageImage.find();
}

export async function insertHomePageImage(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await HomePageImage.collection.insertOne({
    id: Number.parseInt(id),
    url:
      "ttps://i.ibb.co/MGZhP6j/piano-music-hdmi-sound-recording-and-reproduction-piano.jpg"
  });
  return await HomePageImage.find();
}

export async function editHomePageImage(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const HomePageImageResult = await HomePageImage.findOne({ id: id });
  await HomePageImageResult.updateOne({
    id: Number.parseInt(id),
    url: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg"
  });
  return await HomePageImage.find();
}

export async function deleteHomePageImage(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const HomePageImageResult = await HomePageImage.findOne({ id: id });
  await HomePageImageResult.updateOne({
    id: Number.parseInt(id),
    url: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg"
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
