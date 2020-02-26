import { Admin } from "../models";
require("dotenv").config();

// export async function insertTheme(id, body) {
//   return await Admin.collection.insertOne({
//     id: id,
//     name: body.name ? body.name : "",
//     password: body.password ? body.password : "",
//     mainColor: body.color ? body.color : "",
//     categories: body.categories ? body.categories : ""
//   });
// }

export async function editAdmin(id, body) {
  const edit = await Admin.updateOne(
    { id: id },
    {
      username: body.name ? body.name : "",
      password: body.password ? body.password : ""
    }
  );
  return edit;
}

export async function findAllAdmin() {
  return await Admin.find();
}

export async function findOneAdmin(id) {
  return await Admin.findOne({ id: id });
}
