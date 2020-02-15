import mongoose from "mongoose";
import { Theme, SuggestedColor, Site } from "../models";
require("dotenv").config();

export async function createTheme() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const SuggestedColorResult = await SuggestedColor.findOne({ id: 1 });
  const SiteResult = await Site.findOne({ id: 1 });
  await Theme.create([
    {
      id: 1,
      name: "Splitter",
      suggested_font: "Calibri",
      code: "abc",
      suggestedColorId: SuggestedColorResult._id,
      siteId: SiteResult._id
    },
    {
      id: 2,
      name: "Strut",
      suggested_font: "Times New Roman",
      code: "abc",
      suggestedColorId: SuggestedColorResult._id,
      siteId: SiteResult._id
    },
    {
      id: 3,
      name: "Spruce",
      suggested_font: "Arial",
      code: "abc",
      suggestedColorId: SuggestedColorResult._id,
      siteId: SiteResult._id
    }
  ]);
  return await Theme.find().populate({
    path: "suggestedColorId siteId",
    populate: [
      {
        path: "postId userId navItemId homePageImageId"
      }
    ]
  });
}

export async function insertTheme(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const SuggestedColorResult = await SuggestedColor.findOne({ id: 1 });
  const SiteResult = await Site.findOne({ id: 1 });
  await Theme.collection.insertOne({
    id: Number.parseInt(id),
    name: "Splitter",
    suggested_font: "Calibri",
    code: "abc",
    suggestedColorId: SuggestedColorResult._id,
    siteId: SiteResult._id
  });
  return await Theme.findOne({ id: id }).populate({
    path: "suggestedColorId siteId",
    populate: [
      {
        path: "postId userId navItemId homePageImageId"
      }
    ]
  });
}

export async function editTheme(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const SuggestedColorResult = await SuggestedColor.findOne({ id: 1 });
  const SiteResult = await Site.findOne({ id: 1 });
  const ThemeResult = await Theme.findOne({ id: id });
  await ThemeResult.updateOne({
    id: Number.parseInt(id),
    name: "Spruce",
    suggested_font: "Arial",
    code: "abc",
    suggestedColorId: SuggestedColorResult._id,
    siteId: SiteResult._id
  });
  return await Theme.findOne({ id: id }).populate({
    path: "suggestedColorId siteId",
    populate: [
      {
        path: "postId userId navItemId homePageImageId"
      }
    ]
  });
}

export async function deleteTheme(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const SuggestedColorResult = await SuggestedColor.findOne({ id: 1 });
  const SiteResult = await Site.findOne({ id: 1 });
  const ThemeResult = await Theme.findOne({ id: id });
  await ThemeResult.updateOne({
    id: Number.parseInt(id),
    name: "Spruce",
    suggested_font: "Arial",
    code: "abc",
    suggestedColorId: SuggestedColorResult._id,
    siteId: SiteResult._id
  });
  return await Theme.findOne({ id: id }).populate({
    path: "suggestedColorId siteId",
    populate: [
      {
        path: "postId userId navItemId homePageImageId"
      }
    ]
  });
}

export async function findAllTheme() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await Theme.find().populate({
    path: "suggestedColorId siteId",
    populate: [
      {
        path: "postId userId navItemId homePageImageId"
      }
    ]
  });
}

export async function findOneTheme(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await Theme.findOne({ id: id }).populate({
    path: "suggestedColorId siteId",
    populate: [
      {
        path: "postId userId navItemId homePageImageId"
      }
    ]
  });
}
