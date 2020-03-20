import { User, Site } from "../models";
import { client as redis } from "../utils/redis_";

export async function deactivateUser(id) {
  const user = await User.findOne({ id: id });
  redis.del(user.token);
  await User.updateOne(
    { id: id },
    {
      isActivated: false,
      token: null
    }
  );
  await Site.updateMany(
    { _id: { $in: user.sites } },
    {
      isPublish: false
    }
  );
  return user;
}

export async function activateUser(id) {
  const user = User.find({ id: id });
  await user.updateOne({
    isActivated: true
  });
  return user;
}

export async function findAllUser() {
  return await User.find()
    .select("id displayName sites picture email isActivated")
    .populate({
      path: "sites",
      select: "id title categories theme sitePath isPublish phone",
      populate: {
        path: "theme",
        select: "name"
      }
    });
}

export async function login({ id, name, email, picture, token }) {
  const user = await User.findOne({
    email
  });
  if (user) {
    if (!user.isActivated) {
      return false;
    }
    await user.updateOne({
      token: token
    });
    return true;
  } else {
    const create = await User.create({
      id: id,
      displayName: name,
      email: email,
      token: token,
      picture: picture
    });
    if (create) {
      return true;
    }
    return false;
  }
}
