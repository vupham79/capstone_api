import { User, Site, mongoose } from "../models";
require("dotenv").config();

export async function createUser() {
  const site = await Site.find({ id: "109919550538707" });
  console.log();
  const user = await User.create([
    {
      id: "1",
      displayName: "Hoang Cao",
      email: "cmhoang123@gmail.com",
      phone: "0907419552",
      accessToken:
        "EAAMIaToJEsABAOgPRL0cXTP1KCUBddRZAUhfWWxiH1xIZCqcyU0yXbL2rlXWxgN0keFOLZC0Wcb4YvBv5guO7t4AOaEJomXxF8ZAcmnZACYRQh1NJywBwVyHZCnggdZABV7Kn8PahQFTCbGPKZAXl4fyDL9SAtVKyKRpbVpMjY7wZBj312HDfO5OYoKK62WvZCKWPAB6xnrdFW9gZDZD",
      isActivated: true,
      sites: [new mongoose.Types.ObjectId(site._id)]
    }
  ]);
  return user;
}

export async function insertUser(id, body) {
  const insert = await User.collection.insertOne({
    id: id,
    displayName: body.displayName ? body.displayName : "",
    email: body.email ? body.email : "",
    phone: body.phone ? body.phone : "",
    accessToken: body.accessToken ? body.accessToken : "",
    picture: body.picture ? body.picture : "",
    isActivated: true,
    sites: body.sites ? body.sites : []
  });
  return insert;
}

export async function editUser(id, body) {
  const update = await User.updateOne(
    { id: id },
    {
      displayName: body.displayName ? body.displayName : "",
      email: body.email ? body.email : "",
      phone: body.phone ? body.phone : "",
      accessToken: body.accessToken ? body.accessToken : "",
      picture: body.picture ? body.picture : ""
    }
  );
  return update;
}

export async function deactivateUser(id) {
  await User.updateOne(
    { id: id },
    {
      isActivated: false
    }
  );
  const user = await User.findOne({ id: id });
  console.log(user);
  const site = await Site.updateMany(
    { users: user._id },
    {
      isPublish: false
    }
  );
  console.log(site);
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
  return await User.find();
}

export async function findOneUser(id) {
  return await User.findOne({ id: id });
}
