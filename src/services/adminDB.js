import { Admin } from "../models";
require("dotenv").config();

export async function loginAdmin(username, password) {
  const login = await Admin.findOne({ username: username, password: password });
  if (login) {
    return login;
  }
  return false;
}

export async function editAdmin(username, password) {
  const edit = await Admin.updateOne(
    { username: username },
    {
      password: password
    }
  );
  return edit;
}

export async function findAllAdmin() {
  return await Admin.find();
}

export async function findOneAdmin(username) {
  return await Admin.findOne({ username: username });
}
