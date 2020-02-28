import { Post, Admin } from "../models";
require("dotenv").config();

export async function insertPost(id, body) {
  return await Post.collection.insertOne({
    id: id,
    title: body.title,
    message: body.message,
    attachments: body.attachments,
    isActive: body.isActive
  });
}

export async function editPost(id, body) {
  const edit = await Post.updateOne(
    { id: id },
    {
      title: body.title,
      message: body.message,
      attachments: body.attachments,
      isActive: body.isActive
    }
  );
  return edit;
}

export async function findAllPost() {
  return await Post.find();
}

export async function findOnePost(id) {
  return await Post.findOne({ id: id });
}
