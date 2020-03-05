import mongoose from "mongoose";
import { Event } from "../models";

export async function insertEvent(id, body) {
  const insert = await Event.create({
    id: id,
    name: body.name,
    description: body.description,
    cover: body.cover,
    startTime: body.startTime,
    endTime: body.endTime,
    location: body.location,
    isCanceled: body.isCanceled,
    url: body.url
  });
  return insert;
}

export async function editEvent(id, body) {
  const update = await Event.updateOne(
    { id: id },
    {
      name: body.name,
      description: body.description,
      cover: body.cover,
      startTime: body.startTime,
      endTime: body.endTime,
      location: body.location,
      isCanceled: body.isCanceled,
      url: body.url
    }
  );
  return update;
}

export async function findAllEvent() {
  return await Event.find();
}

export async function findOneEvent(id) {
  return await Event.findOne({ id: id });
}
