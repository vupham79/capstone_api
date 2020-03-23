import { Theme } from "../models";

export async function editTheme(id, body) {
  const edit = await Theme.updateOne(
    { id: id },
    {
      name: body.name,
      fontTitle: body.fontTitle,
      fontBody: body.fontBody,
      mainColor: body.color,
      categories: body.categories,
      previewImage: body.previewImage,
      categories: body.categories
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
