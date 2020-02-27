import { SitePath } from "../models";
require("dotenv").config();

export async function insertSitePath(pathName) {
  const insert = await SitePath.collection.insertOne({
    pathName: pathName
  });
  return insert;
}

export async function findAllSitePath() {
  return await SitePath.find();
}
