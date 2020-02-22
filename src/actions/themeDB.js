import { Theme, Site } from "../models";
require("dotenv").config();

// export async function insertTheme(id, body) {
//   return await Theme.collection.insertOne({
//     id: id,
//     name: body.name ? body.name : "",
//     fontTitle: body.fontTitle ? body.fontTitle : "",
//     mainColor: body.color ? body.color : "",
//     categories: body.categories ? body.categories : ""
//   });
// }

export async function editTheme(id, body) {
  const ThemeResult = await Theme.findOne({ id: id });
  return await ThemeResult.updateOne({
    name: body.name ? body.name : "",
    fontTitle: body.fontTitle ? body.fontTitle : "",
    mainColor: body.color ? body.color : "",
    categories: body.categories ? body.categories : ""
  });
}

export async function findAllTheme() {
  return await Theme.find();
}

export async function findOneThemeByCategory(name) {
  const theme = await Theme.collection.findOne({ "categories.name": name });
  if (theme) {
    return theme;
  } else {
    return await Theme.findOne();
  }
}

export async function findOneTheme(id) {
  return await Theme.findOne({ id: id });
}
