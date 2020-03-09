import { User } from "../models";
require("dotenv").config();

export const login = async ({ id, name, email, picture }) => {
  const user = await User.findOne({
    email
  });
  if (user) {
    if (!user.isActivated) {
      return false;
    }
    return true;
  } else {
    const create = await User.create({
      id: id,
      displayName: name,
      email: email,
      picture: picture
    });
    if (create) {
      return true;
    }
    return false;
  }
};
