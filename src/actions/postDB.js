import mongoose, { Schema } from "mongoose";
import { Post, Video, Image } from "../models";
require("dotenv").config();

export async function createPost() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const VideoResult = await Video.findOne({ id: "1" });
  const ImageResult = await Image.findOne({ id: "1" });
  await Post.create({
    id: "1",
    content: "Beethoven 1",
    videoId: VideoResult._id,
    imageId: ImageResult._id
  });
  return await Post.find().populate({
    path: "videoId imageId"
  });
}

export async function insertPost(id, body) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const VideoResult = await Video.findOne({ id: id });
  const ImageResult = await Image.findOne({ id: id });
  await Post.collection.insertOne({
    id: id,
    content: body.content,
    videoId: VideoResult._id,
    imageId: ImageResult._id
  });
  return await Post.find().populate({
    path: "videoId imageId"
  });
}

export async function editPost(id, body) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const PostResult = await Post.findOne({ id: id });
  await PostResult.updateOne({
    content: body.content
  });
  return await Post.find().populate({
    path: "videoId imageId"
  });
}

export async function findAllPost() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await Post.find().populate({
    path: "videoId imageId"
  });
}

export async function findOnePost(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await Post.findOne({ id: id }).populate({
    path: "videoId imageId"
  });
}
