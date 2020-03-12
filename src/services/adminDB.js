import { Admin } from "../models";

export async function loginAdmin(username, password) {
  return await Admin.findOne({ username: username, password: password });
}
