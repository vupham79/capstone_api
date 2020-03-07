import { User, Site, mongoose } from "../models";

// export async function createUser() {
//   const site = await Site.findOne({ id: "109919550538707" });
//   const user = await User.create([
//     {
//       id: "1",
//       displayName: "Hoang Cao",
//       email: "cmhoang123@gmail.com",
//       phone: "0907419552",
//       accessToken:
//         "EAAMIaToJEsABAOgPRL0cXTP1KCUBddRZAUhfWWxiH1xIZCqcyU0yXbL2rlXWxgN0keFOLZC0Wcb4YvBv5guO7t4AOaEJomXxF8ZAcmnZACYRQh1NJywBwVyHZCnggdZABV7Kn8PahQFTCbGPKZAXl4fyDL9SAtVKyKRpbVpMjY7wZBj312HDfO5OYoKK62WvZCKWPAB6xnrdFW9gZDZD",
//       isActivated: true,
//       sites: [new mongoose.Types.ObjectId(site._id)]
//     }
//   ]);
//   return user;
// }

// export async function insertUser(id, body) {
//   const insert = await User.collection.insertOne({
//     id: id,
//     displayName: body.displayName,
//     email: body.email,
//     phone: body.phone,
//     accessToken: body.accessToken,
//     picture: body.picture,
//     isActivated: true,
//     sites: body.sites ? body.sites : null
//   });
//   return insert;
// }

// export async function editUser(id, body) {
//   const update = await User.updateOne(
//     { id: id },
//     {
//       displayName: body.displayName,
//       email: body.email,
//       phone: body.phone,
//       accessToken: body.accessToken,
//       picture: body.picture
//     }
//   );
//   return update;
// }

export async function deactivateUser(id) {
  await User.updateOne(
    { id: id },
    {
      isActivated: false
    }
  );
  const user = await User.findOne({ id: id });
  const site = await Site.updateMany(
    { user: user._id },
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
    .select("id displayName sites picture")
    .populate({
      path: "sites",
      select: "id title categories theme sitePath isPublish",
      populate: {
        path: "theme",
        select: "name"
      }
    });
}

// export async function findOneUser(id) {
//   return await User.findOne({ id: id });
// }
