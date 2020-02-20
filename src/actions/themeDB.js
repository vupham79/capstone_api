import mongoose from "mongoose";
import { Theme, Site } from "../models";
require("dotenv").config();

export async function createTheme() {
  const SiteResult = await Site.findOne({ id: "1" });
  await Theme.create([
    {
      id: "1",
      name: "Splitter",
      mainFont: "Calibri",
      mainColor: "red",
      categories: ["Product"],
      siteId: SiteResult._id
    },
    {
      id: "2",
      name: "Strut",
      mainFont: "Times New Roman",
      mainColor: "blue",
      categories: ["Product"],
      siteId: SiteResult._id
    },
    {
      id: "3",
      name: "Spruce",
      mainFont: "Arial",
      mainColor: "green",
      categories: ["Product"],
      siteId: SiteResult._id
    }
  ]);
  return await Theme.find().populate({
    path: "siteId",
    populate: [
      {
        path: "posts userId homePageImageId"
      }
    ]
  });
}

export async function insertTheme(id, body) {
  const SiteResult = await Site.findOne({ id: id });
  await Theme.collection.insertOne({
    id: id,
    name: body.name,
    mainFont: body.mainFont,
    mainColor: body.mainColor,
    categories: body.categories,
    siteId: SiteResult._id
  });
  return await Theme.find().populate({
    path: "siteId",
    populate: [
      {
        path: "posts userId homePageImageId"
      }
    ]
  });
}

export async function editTheme(id, body) {
  const ThemeResult = await Theme.findOne({ id: id });
  await ThemeResult.updateOne({
    name: body.name,
    mainFont: body.mainFont,
    mainColor: body.color,
    categories: body.categories
  });
  return await Theme.findOne({ id: id }).populate({
    path: "siteId",
    populate: [
      {
        path: "posts userId homePageImageId"
      }
    ]
  });
}

export async function findAllTheme() {
  return await Theme.find().populate({
    path: "siteId",
    populate: [
      {
        path: "posts userId homePageImageId"
      }
    ]
  });
}

export async function findOneTheme(id) {
  return await Theme.findOne({ id: id }).populate({
    path: "siteId",
    populate: [
      {
        path: "posts userId homePageImageId"
      }
    ]
  });
}
