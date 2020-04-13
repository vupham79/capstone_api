import { Category } from "../models";

export async function insertCategory(body) {
  return await Category.collection.insertOne({
    name: body.name,
    picture: body.picture,
  });
}

export async function editCategory(id, name, picture) {
  const edit = await Category.updateOne(
    { _id: id },
    {
      name: name,
      picture: picture,
    }
  );
  return edit;
}

export async function findAllCategory() {
  return await Category.find({ isDeleted: false });
}

export async function findOneCategory(id) {
  return await Category.findOne({ id: id });
}

export async function deleteCategory(id) {
  return await Category.updateOne({ _id: id }, { isDeleted: true });
}
