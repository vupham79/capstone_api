import { Admin } from "../models";

export async function loginAdmin(username, password) {
  return await Admin.findOne({ username: username, password: password });
}

export async function editAdmin(username, password) {
  return await Admin.updateOne(
    { username: username },
    {
      password: password
    }
  );
}

export async function findAllAdmin() {
  return await Admin.find();
}

export async function findOneAdmin(username) {
  return await Admin.findOne({ username: username });
}
