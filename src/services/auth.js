import { User } from "../models";
import jwt from "jsonwebtoken";
require("dotenv").config();

export const login = async ({ accessToken, id, name, email, picture }) => {
  const user = await User.findOne({
    email
  });
  if (user) {
    const token = jwt.sign({ email, accessToken }, process.env.secret);
    return token;
  } else {
    const create = await User.create({
      id: id,
      displayName: name,
      email: email,
      picture: picture
    });
    if (create) {
      const token = jwt.sign({ email, accessToken }, process.env.secret);
      return token;
    }
    return false;
  }
};
