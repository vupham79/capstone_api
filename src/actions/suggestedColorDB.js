import mongoose from "mongoose";
import { SuggestedColor } from "../models";
require("dotenv").config();

export async function createSuggestedColor() {
  await SuggestedColor.create([
    {
      id: "1",
      color: "red"
    },
    {
      id: "2",
      color: "green"
    },
    {
      id: "3",
      color: "orange"
    }
  ]);
  return await SuggestedColor.find();
}

export async function insertSuggestedColor(id, body) {
  await SuggestedColor.collection.insertOne({
    id: id,
    color: body.color
  });
  return await SuggestedColor.find();
}

export async function editSuggestedColor(id, body) {
  const SuggestedColorResult = await SuggestedColor.findOne({ id: id });
  await SuggestedColorResult.updateOne({
    color: body.color
  });
  return await SuggestedColor.find();
}

export async function findAllSuggestedColor() {
  return await SuggestedColor.find();
}

export async function findOneSuggestedColor(id) {
   
  return await SuggestedColor.findOne({ id: id });
}
