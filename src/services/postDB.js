import { Post } from "../models";

export async function insertPost(body) {
  return await Post.collection.insertOne({
    id: body.id,
    title: body.title,
    message: body.message,
    attachments: body.attachments,
    isActive: body.isActive
  });
}

export async function insertAllPost(body) {
  await Post.collection.insertMany(body, (error, docs) => {
    if (error) {
      return error;
    } else {
      docs;
      return docs;
    }
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
