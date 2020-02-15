import mongoose from "mongoose";
import { NavItem } from "../models";
require("dotenv").config();

export async function createNavItem() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await NavItem.create([
    {
      id: 1,
      order: "1",
      title: "About",
      url: "a"
    },
    {
      id: 2,
      order: "2",
      title: "News",
      url: "a"
    },
    {
      id: 3,
      order: "3",
      title: "Contact",
      url: "a"
    }
  ]);
  return await NavItem.find();
}

export async function insertNavItem(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await NavItem.collection.insertOne({
    id: Number.parseInt(id),
    order: "4",
    title: "Events",
    url: "a"
  });
  return await NavItem.find();
}

export async function editNavItem(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const NavItemResult = await NavItem.findOne({ id: id });
  await NavItemResult.updateOne({
    id: Number.parseInt(id),
    order: "5",
    title: "News",
    url: "a"
  });
  return await NavItem.find();
}

export async function deleteNavItem(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const NavItemResult = await NavItem.findOne({ id: id });
  await NavItemResult.updateOne({
    id: Number.parseInt(id),
    order: "5",
    title: "News",
    url: "a"
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
