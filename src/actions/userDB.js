import mongoose from "mongoose";
import { User } from "../models";
require("dotenv").config();
import request from "request";

export async function createUser() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await User.create([
    {
      id: "1",
      displayName: "Hoang Cao",
      email: "cmhoang123@gmail.com",
      phone: "0907419552",
      accessToken:
        "EAAMIaToJEsABAOgPRL0cXTP1KCUBddRZAUhfWWxiH1xIZCqcyU0yXbL2rlXWxgN0keFOLZC0Wcb4YvBv5guO7t4AOaEJomXxF8ZAcmnZACYRQh1NJywBwVyHZCnggdZABV7Kn8PahQFTCbGPKZAXl4fyDL9SAtVKyKRpbVpMjY7wZBj312HDfO5OYoKK62WvZCKWPAB6xnrdFW9gZDZD",
      isActivated: true
    },
    {
      id: "2",
      displayName: "Cao Minh",
      email: "hoangcmse61788@fpt.edu.vn",
      phone: "0907419552",
      accessToken:
        "EAAMIaToJEsABAOgPRL0cXTP1KCUBddRZAUhfWWxiH1xIZCqcyU0yXbL2rlXWxgN0keFOLZC0Wcb4YvBv5guO7t4AOaEJomXxF8ZAcmnZACYRQh1NJywBwVyHZCnggdZABV7Kn8PahQFTCbGPKZAXl4fyDL9SAtVKyKRpbVpMjY7wZBj312HDfO5OYoKK62WvZCKWPAB6xnrdFW9gZDZD",
      isActivated: true
    }
  ]);
  return await User.find();
}

export async function insertUser(id, body) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await User.collection.insertOne({
    id: id,
    displayName: body.displayName,
    email: body.email,
    phone: body.phone,
    accessToken: body.accessToken,
    isActivated: true
  });
  return await User.find();
}

export async function editUser(id, body) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const UserResult = await User.findOne({ id: id });
  await UserResult.updateOne({
    displayName: body.displayName,
    email: body.email,
    phone: body.phone,
    accessToken: body.accessToken,
    isActivated: true
  });
  return await User.find();
}

export async function findAllUser() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await User.find();
}

export async function findOneUser(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await User.findOne({ id: id });
}
