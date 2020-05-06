import { User, Site } from "../models";
import { client as redis } from "../utils/redis_";

export async function deactivateUser(id) {
  const user = await User.findOne({ id: id });
  if (user) {
    if (user.token) {
      redis.del(user.token);
    }
    await user.updateOne({
      isActivated: false,
      token: null,
    });
    await Site.updateMany(
      { _id: { $in: user.sites } },
      { $set: { isPublish: false } }
    );
    return user;
  }
  return false;
}

export async function activateUser(id) {
  const user = User.find({ id: id });
  if (user) {
    await user.updateOne({
      isActivated: true,
    });
    return user;
  }
  return false;
}

export async function findAllUser() {
  return await User.find()
    .select("id displayName sites picture email isActivated")
    .populate({
      path: "sites categories",
      select: "id title categories theme sitePath isPublish phone url",
      populate: {
        path: "theme",
        select: "name",
      },
    });
}

export async function login({ id, name, email, picture, token }) {
  const user = await User.findOne({
    email,
  });
  if (user) {
    if (!user.isActivated) {
      return false;
    }
    await user.updateOne({
      picture: picture,
      token: token,
    });
    return true;
  } else {
    const create = await User.create({
      id: id,
      displayName: name,
      email: email,
      token: token,
      picture: picture,
    });
    if (create) {
      return true;
    }
    return false;
  }
}
