import mongoose from "mongoose";
import { Image } from "../models";
require("dotenv").config();

export async function createImage() {
  await Image.create([
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
  return await Image.find();
}

export async function insertImage(id, body) {
  await Image.collection.insertOne({
    id: id,
    url: body.url
  });
  return await Image.find();
}

export async function editImage(id, body) {
  const ImageResult = await Image.findOne({ id: id });
  await ImageResult.updateOne({
    url: body.url
  });
  return await Image.find();
}

export async function findAllImage() {
  return await Image.find();
}

export async function findOneImage(id) {
  return await Image.findOne({ id: id });
}
