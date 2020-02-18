import mongoose from "mongoose";
import { NavItem } from "../models";
require("dotenv").config();

export async function createNavItem() {
  await NavItem.create({
    id: "1",
    order: "1",
    title: "About"
  });
  return await NavItem.find();
}

export async function insertNavItem(id, body) {
  await NavItem.collection.insertOne({
    id: id,
    order: body.order,
    title: body.title
  });
  return await NavItem.find();
}

export async function editNavItem(id, body) {
  const NavItemResult = await NavItem.findOne({ id: id });
  await NavItemResult.updateOne({
    order: body.order,
    title: body.title
  });
  return await NavItem.find();
}

export async function findAllNavItem() {
  return await NavItem.find();
}

export async function findOneNavItem(id) {
  return await NavItem.findOne({ id: id });
}
