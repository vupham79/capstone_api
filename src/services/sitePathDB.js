import { SitePath } from "../models";

export async function insertSitePath(pathName) {
  const insert = await SitePath.collection.insertOne({
    pathName: pathName
  });
  return insert;
}

export async function updateSitePath(pathName) {
  const insert = await SitePath.collection.updateOne({
    pathName: pathName
  });
  return insert;
}

export async function findOneSitePath(pathname) {
  return await SitePath.findOne({ pathname });
}

export async function findAllSitePath() {
  return await SitePath.find();
}
