import { Site } from "../models";

export async function findAll() {
  return await Site.find().select("sitePath");
}
