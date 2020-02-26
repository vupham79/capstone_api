import { Theme, Admin } from "../models";
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
  const edit = await Theme.updateOne(
    { id: id },
    {
      name: body.name ? body.name : "",
      fontTitle: body.fontTitle ? body.fontTitle : "",
      mainColor: body.color ? body.color : "",
      categories: body.categories ? body.categories : ""
    }
  );
  return edit;
}

export async function findAllTheme() {
  return await Theme.find();
}

export async function findAllThemeByAdmin(username, password) {
  const admin = await Admin.findOne({
    username: username,
    password: password
  });
  if (admin) {
    return await Theme.find();
  }
  return false;
}

export async function findOneThemeByCategory(name) {
  const theme = await Theme.collection.findOne({ "categories.name": name });
  return theme;
}

export async function findOneTheme(id) {
  return await Theme.findOne({ id: id });
}
