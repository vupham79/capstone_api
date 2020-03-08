import { Theme, Admin } from "../models";

// export async function insertTheme(id, body) {
//   return await Theme.collection.insertOne({
//     id: id,
//     name: body.name,
//     fontTitle: body.fontTitle,
//     mainColor: body.color,
//     categories: body.categories
//   });
// }

export async function editTheme(id, body) {
  const edit = await Theme.updateOne(
    { id: id },
    {
      name: body.name,
      fontTitle: body.fontTitle,
      fontBody: body.fontBody,
      mainColor: body.color,
      categories: body.categories
    }
  );
  return edit;
}

export async function findAllTheme() {
  return await Theme.find();
}

// export async function findOneThemeByCategory(name) {
//   const theme = await Theme.collection.findOne({ "categories.name": name });
//   return theme;
// }

export async function findOneTheme(id) {
  return await Theme.findOne({ id: id });
}
