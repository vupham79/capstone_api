import { Post } from "../models";

export async function insertPost(body) {
  return await Post.collection.insertOne({
    id: body.id,
    title: body.title,
    message: body.message,
    createdTime: body.createdTime,
    attachments: body.attachments,
    isActive: body.isActive,
    target: body.target
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

// export async function editPost(id, body) {
//   const edit = await Post.updateOne(
//     { id: id },
//     {
//       title: body.title,
//       message: body.message,
//       attachments: body.attachments,
//       isActive: body.isActive,
//       target: body.target
//     }
//   );
//   return edit;
// }

export async function activePost(body) {
  if (body.activeList) {
    await Post.updateMany(
      {
        id: { $in: body.activeList.map(post => post.id) }
      },
      {
        isActive: true
      }
    );
  }
  if (body.deactiveList) {
    await Post.updateMany(
      {
        id: { $in: body.deactiveList.map(post => post.id) }
      },
      {
        isActive: false
      }
    );
  }
  return true;
}

export async function findAllPost() {
  return await Post.find();
}

export async function findOnePost(id) {
  return await Post.findOne({ id: id });
}
