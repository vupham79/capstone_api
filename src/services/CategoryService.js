import { Category } from "../models";

export async function insertCategory(body) {
  return await Category.collection.insertOne({
    id: body.id,
    name: body.name
  });
}

export async function editCategory(id, name) {
  const edit = await Category.updateOne(
    { id: id },
    {
      name: name
    }
  );
  return edit;
}

export async function findAllCategory() {
  return await Category.find();
}

export async function findOneCategory(id) {
  return await Category.findOne({ id: id });
}
