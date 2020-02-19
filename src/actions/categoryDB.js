import mongoose from "mongoose";
import { Category, SuggestedTheme } from "../models";
require("dotenv").config();

export async function createCategory() {
  await Category.create([
    {
      id: "1",
      name: "Spruce"
    },
    {
      id: "2",
      name: "Splitter"
    },
    {
      id: "3",
      name: "Sprut"
    }
  ]);
  return await Category.find();
}

export async function insertCategory(id, body) {
  const SuggestedThemeResult = await SuggestedTheme.findOne({ id: id });
  await Category.collection.insertOne({
    id: id,
    name: body.name,
    suggestedThemeId: SuggestedThemeResult && SuggestedThemeResult._id
  });
  return await Category.find();
}

export async function editCategory(id, body) {
  const CategoryResult = await Category.findOne({ id: id });
  await CategoryResult.updateOne({
    name: body.name
  });
  return await Category.find();
}

export async function findAllCategory() {
  return await Category.find();
}

export async function findOneCategory(id) {
  return await Category.findOne({ id: id });
}
