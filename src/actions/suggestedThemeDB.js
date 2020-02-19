import mongoose from "mongoose";
import { SuggestedTheme } from "../models";
require("dotenv").config();

export async function createSuggestedTheme() {
  await SuggestedTheme.create([
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
  return await SuggestedTheme.find();
}

export async function insertSuggestedTheme(id, body) {
  await SuggestedTheme.collection.insertOne({
    id: id,
    name: body.name
  });
  return await SuggestedTheme.find();
}

export async function editSuggestedTheme(id, body) {
  const SuggestedThemeResult = await SuggestedTheme.findOne({ id: id });
  await SuggestedThemeResult.updateOne({
    name: body.name
  });
  return await SuggestedTheme.find();
}

export async function findAllSuggestedTheme() {
  return await SuggestedTheme.find();
}

export async function findOneSuggestedTheme(id) {
  return await SuggestedTheme.findOne({ id: id });
}
