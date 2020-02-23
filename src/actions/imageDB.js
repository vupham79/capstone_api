import { Image } from "../models";
require("dotenv").config();

export async function insertImage(id, body, session = null) {
  await Image.create(
    [
      {
        id: id,
        url: body.url ? body.url : ""
      }
    ],
    { session }
  );
}

export async function editImage(id, body) {
  const ImageResult = await Image.findOne({ id: id });
  await ImageResult.updateOne({
    url: body.url ? body.url : ""
  });
  return ImageResult;
}

export async function findAllImage() {
  return await Image.find();
}

export async function findOneImage(id) {
  return await Image.findOne({ id: id });
}
