import mongoose from "mongoose";
import { Theme, SuggestedColor, Site } from "../models";
require("dotenv").config();

export async function createTheme() {
  const SuggestedColorResult = await SuggestedColor.findOne({ id: "1" });
  const SiteResult = await Site.findOne({ id: "1" });
  await Theme.create([
    {
      id: "1",
      name: "Splitter",
      suggested_font: "Calibri",
      suggestedColorId: SuggestedColorResult._id,
      siteId: SiteResult._id
    },
    {
      id: "2",
      name: "Strut",
      suggested_font: "Times New Roman",
      suggestedColorId: SuggestedColorResult._id,
      siteId: SiteResult._id
    },
    {
      id: "3",
      name: "Spruce",
      suggested_font: "Arial",
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

export async function insertTheme(id, body) {
  const SuggestedColorResult = await SuggestedColor.findOne({ id: id });
  const SiteResult = await Site.findOne({ id: id });
  await Theme.collection.insertOne({
    id: id,
    name: body.name,
    suggested_font: body.suggested_font,
    suggestedColorId: SuggestedColorResult._id,
    siteId: SiteResult._id
  });
  return await Theme.find().populate({
    path: "suggestedColorId siteId",
    populate: [
      {
        path: "postId userId navItemId homePageImageId"
      }
    ]
  });
}

export async function editTheme(id, body) {
  const ThemeResult = await Theme.findOne({ id: id });
  await ThemeResult.updateOne({
    name: body.name,
    suggested_font: body.suggested_font
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
  return await Theme.findOne({ id: id }).populate({
    path: "suggestedColorId siteId",
    populate: [
      {
        path: "postId userId navItemId homePageImageId"
      }
    ]
  });
}
