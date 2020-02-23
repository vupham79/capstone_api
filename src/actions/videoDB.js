import { Video } from "../models";
require("dotenv").config();

export async function createVideo() {
  await Video.create([
    {
      id: "1",
      url: "https://www.youtube.com/watch?v=4Tr0otuiQuU"
    },
    {
      id: "2",
      url: "https://www.youtube.com/watch?v=W-fFHeTX70Q"
    },
    {
      id: "3",
      url: "https://www.youtube.com/watch?v=t3217H8JppI"
    }
  ]);
  return await Video.find();
}

export async function insertVideo(id, body, session = null) {
  Video.create(
    [
      {
        id: id,
        url: body.url ? body.url : ""
      }
    ],
    { session }
  );
}

export async function editVideo(id, body) {
  const video = await Video.findOne({ id: id });
  await video.updateOne({
    url: body.url ? body.url : ""
  });
  return video;
}

export async function findAllVideo() {
  return await Video.find();
}

export async function findOneVideo(id) {
  return await Video.findOne({ id: id });
}
