import mongoose from "mongoose";
import { User } from "../models";
require("dotenv").config();

export async function createUser() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await User.create([
    {
      id: 1,
      displayName: "Hoang Cao",
      email: "cmhoang123@gmail.com",
      phone: "0907419552",
      accessToken:
        "EAAMIaToJEsABAOgPRL0cXTP1KCUBddRZAUhfWWxiH1xIZCqcyU0yXbL2rlXWxgN0keFOLZC0Wcb4YvBv5guO7t4AOaEJomXxF8ZAcmnZACYRQh1NJywBwVyHZCnggdZABV7Kn8PahQFTCbGPKZAXl4fyDL9SAtVKyKRpbVpMjY7wZBj312HDfO5OYoKK62WvZCKWPAB6xnrdFW9gZDZD",
      isActivated: true
    },
    {
      id: 2,
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

export async function insertUser(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await User.collection.insertOne({
    id: Number.parseInt(id),
    displayName: "Hoang Cao Minh",
    email: "cmhoang@gmail.com",
    phone: "0907419552",
    accessToken:
      "EAAMIaToJEsABAOgPRL0cXTP1KCUBddRZAUhfWWxiH1xIZCqcyU0yXbL2rlXWxgN0keFOLZC0Wcb4YvBv5guO7t4AOaEJomXxF8ZAcmnZACYRQh1NJywBwVyHZCnggdZABV7Kn8PahQFTCbGPKZAXl4fyDL9SAtVKyKRpbVpMjY7wZBj312HDfO5OYoKK62WvZCKWPAB6xnrdFW9gZDZD",
    isActivated: true
  });
  return await User.find();
}

export async function editUser(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const UserResult = await User.findOne({ id: id });
  await UserResult.updateOne({
    id: Number.parseInt(id),
    displayName: "Hoang Cao Minh",
    email: "cmhoang@gmail.com",
    phone: "0907419552",
    accessToken:
      "EAAMIaToJEsABAOgPRL0cXTP1KCUBddRZAUhfWWxiH1xIZCqcyU0yXbL2rlXWxgN0keFOLZC0Wcb4YvBv5guO7t4AOaEJomXxF8ZAcmnZACYRQh1NJywBwVyHZCnggdZABV7Kn8PahQFTCbGPKZAXl4fyDL9SAtVKyKRpbVpMjY7wZBj312HDfO5OYoKK62WvZCKWPAB6xnrdFW9gZDZD",
    isActivated: true
  });
  return await User.find();
}

export async function deleteUser(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const UserResult = await User.findOne({ id: id });
  await UserResult.updateOne({
    id: Number.parseInt(id),
    displayName: "Hoang Cao Minh",
    email: "cmhoang@gmail.com",
    phone: "0907419552",
    accessToken:
      "EAAMIaToJEsABAOgPRL0cXTP1KCUBddRZAUhfWWxiH1xIZCqcyU0yXbL2rlXWxgN0keFOLZC0Wcb4YvBv5guO7t4AOaEJomXxF8ZAcmnZACYRQh1NJywBwVyHZCnggdZABV7Kn8PahQFTCbGPKZAXl4fyDL9SAtVKyKRpbVpMjY7wZBj312HDfO5OYoKK62WvZCKWPAB6xnrdFW9gZDZD",
    isActivated: false
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
