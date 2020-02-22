import mongoose, { Schema } from "mongoose";
import { Post, Video, Image } from "../models";
require("dotenv").config();

export async function createPost() {
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

export async function insertPost(id, { content }) {
  const VideoResult = await Video.findOne({ id: id });
  const ImageResult = await Image.findOne({ id: id });
  const post = await Post.create({
    id: id,
    content: content ? content : "",
    videoId: VideoResult && VideoResult._id,
    imageId: ImageResult && ImageResult._id
  });
  return post;
}

export async function editPost(id, body) {
  const PostResult = await Post.findOne({ id: id });
  await PostResult.updateOne({
    content: body.content ? body.content : ""
  });
  return await Post.find().populate({
    path: "videoId imageId"
  });
}

export async function findAllPost() {
  return await Post.find().populate({
    path: "videoId imageId"
  });
}

export async function findOnePost(id) {
  return await Post.findOne({ id: id }).populate({
    path: "videoId imageId"
  });
}
