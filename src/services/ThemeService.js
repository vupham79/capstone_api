import { Theme, Category } from "../models";

export async function insertTheme(body) {
  console.log("body: ", body);
  const themeResult = await Theme.findOne({ name: body.name });
  let insert = null;
  if (!themeResult) {
    let category = await Category.findOne({ _id: body.category });
    insert = await Theme.create({
      name: body.name,
      fontTitle: body.fontTitle,
      fontBody: body.fontBody,
      mainColor: body.color,
      previewImage: body.previewImage,
      category: category,
    });
  }
  return insert;
}

export async function editTheme(id, body) {
  let category = await Category.findOne({ _id: body.category });
  const edit = await Theme.updateOne(
    { _id: id },
    {
      name: body.name,
      fontTitle: body.fontTitle,
      fontBody: body.fontBody,
      mainColor: body.color,
      previewImage: body.previewImage,
      category: category,
    }
  );
  return edit;
}

export async function findAllTheme() {
  return await Theme.find().populate("category");
}

export async function findOneTheme(id) {
  return await Theme.findOne({ _id: id });
}
