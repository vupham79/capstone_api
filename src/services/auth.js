import { User } from "../models";

export const login = async ({ accessToken, id, name, email, picture }) => {
  const user = await User.findOne({
    id: id
  });
  if (user) {
    const update = await User.updateOne(
      {
        id: id
      },
      {
        accessToken: accessToken
      }
    );
    if (update) {
      return true;
    }
    return false;
  } else {
    const create = await User.create({
      id: id,
      displayName: name,
      email: email,
      accessToken: accessToken,
      picture: picture
    });
    if (create) {
      return true;
    }
    return false;
  }
};
