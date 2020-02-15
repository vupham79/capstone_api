import mongoose from "mongoose";
import { SuggestedColor } from "../models";
require("dotenv").config();

export async function createSuggestedColor() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await SuggestedColor.create([
    {
      id: 1,
      color: "red"
    },
    {
      id: 2,
      color: "green"
    },
    {
      id: 3,
      color: "orange"
    }
  ]);
  return await SuggestedColor.find();
}

export async function insertSuggestedColor(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  await SuggestedColor.collection.insertOne({
    id: Number.parseInt(id),
    color: "green"
  });
  return await SuggestedColor.find();
}

export async function editSuggestedColor(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const SuggestedColorResult = await SuggestedColor.findOne({ id: id });
  await SuggestedColorResult.updateOne({
    id: Number.parseInt(id),
    color: "orange red"
  });
  return await SuggestedColor.find();
}

export async function deleteSuggestedColor(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const SuggestedColorResult = await SuggestedColor.findOne({ id: id });
  await SuggestedColorResult.updateOne({
    id: Number.parseInt(id),
    color: "orange red"
  });
  return await SuggestedColor.find();
}

export async function findAllSuggestedColor() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await SuggestedColor.find();
}

export async function findOneSuggestedColor(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await SuggestedColor.findOne({ id: id });
}
