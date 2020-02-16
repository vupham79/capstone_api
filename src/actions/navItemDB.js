import mongoose from "mongoose";
import { NavItem } from "../models";
require("dotenv").config();

export async function createNavItem() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await NavItem.create({
    id: "1",
    order: "1",
    title: "About",
    url: "a"
  });
  return await NavItem.find();
}

export async function insertNavItem(id, body) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await NavItem.collection.insertOne({
    id: id,
    order: body.order,
    title: body.title,
    url: body.url
  });
  return await NavItem.find();
}

export async function editNavItem(id, body) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const NavItemResult = await NavItem.findOne({ id: id });
  await NavItemResult.updateOne({
    order: body.order,
    title: body.title,
    url: body.url
  });
  return await NavItem.find();
}

export async function findAllNavItem() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await NavItem.find();
}

export async function findOneNavItem(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await NavItem.findOne({ id: id });
}
