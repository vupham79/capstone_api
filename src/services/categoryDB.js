import { Category } from "../models";
require("dotenv").config();

export async function insertCategory(id, body) {
  const insert = await Category.collection.insertOne({
    id: id,
    name: body.name ? body.name : ""
  });
  return insert;
}

export async function editCategory(id, body) {
  const edit = await Category.updateOne(
    { id: id },
    {
      name: body.name ? body.name : ""
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
