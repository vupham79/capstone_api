import { Theme, Category } from "../models";
import mongoose from "mongoose";

export async function insertTheme(id, body) {
  const themeResult = await Theme.findOne({ id: id });
  let insert = null;
  if (!themeResult) {
    insert = await Theme.create({
      id: id,
      name: body.name,
      fontTitle: body.fontTitle,
      fontBody: body.fontBody,
      mainColor: body.color,
      previewImage: body.previewImage
    });
    let category = await Category.findOne({ name: body.categoryName });
    if (category) {
      let themeList = category.themes;
      themeList.push(new mongoose.Types.ObjectId(insert._id));
      await Category.updateOne(
        { name: body.categoryName },
        { themes: themeList }
      );
    }
  }
  return insert;
}

export async function editTheme(id, body) {
  const edit = await Theme.updateOne(
    { id: id },
    {
      name: body.name,
      fontTitle: body.fontTitle,
      fontBody: body.fontBody,
      mainColor: body.color,
      previewImage: body.previewImage
    }
  );
  return edit;
}

export async function findAllTheme() {
  return await Theme.find();
}

export async function findOneTheme(id) {
  return await Theme.findOne({ id: id });
}
