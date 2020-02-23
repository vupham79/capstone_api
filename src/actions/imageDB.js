import { Image } from "../models";
import { mongoose } from "../models";
require("dotenv").config();

export async function createImage() {
  // let session = null;
  Image.createCollection()
    .then(() => Image.startSession())
    .then(session =>
      session.withTransaction(() => {
        return Image.create(
          [
            {
              id: "1",
              url: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg"
            },
            {
              id: "2",
              url: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg"
            }
          ],
          { session: session }
        );
      })
    )
    .then(console.log("32211"));
  // mongoose
  //   .startSession()
  //   .then(async _session => {
  //     session = _session;
  //     await session.startTransaction();
  //     console.log("opts: ", session);
  //     return Image.create(
  //       [
  //         {
  //           id: "1",
  //           url: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg"
  //         }
  //       ],
  //       { session: session }
  //     );
  //   })
  //   .then(() => {
  //     console.log("1233");
  //     Image.create([
  //       {
  //         id: "2",
  //         url: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg"
  //       }
  //     ]);
  //   })
  //   .then(() => {
  //     console.log("32211");
  //     session.commitTransaction();
  //   })
  //   .catch(e => {
  //     console.log("error: ", e);
  //     return e;
  //   });
  // try {
  //   let session = null;
  //   Image.createCollection()
  //     .then(() => Image.startSession())
  //     .then(_session => {
  //       session = _session;
  //       session.startTransaction();
  //       return Image.create(
  //         [
  //           {
  //             id: "1",
  //             url: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg"
  //           },
  //           {
  //             id: 2,
  //             url: "https://i.ibb.co/0qXLK9v/transparent-piano.jpg"
  //           },
  //           {
  //             id: 3,
  //             url: "https://i.ibb.co/KDkDJyk/piano-icon-30.jpg"
  //           }
  //         ],
  //         { session: session }
  //       );
  //     })
  //     .then(() => Image.find().session(session))
  //     .then(() => session.commitTransaction())
  //     .then(() => session.endSession());
  // } catch (error) {
  //   await session.abortTransaction();
  //   session.endSession();
  //   throw error;
  // }
  // .then(() => Customer.countDocuments())
  // .then(count => assert.strictEqual(count, 0));
  // return await Image.find();
}

export async function insertImage(id, body) {
  await Image.collection.insertOne({
    id: id,
    url: body.url ? body.url : ""
  });
  return await Image.find();
}

export async function editImage(id, body) {
  const ImageResult = await Image.findOne({ id: id });
  await ImageResult.updateOne({
    url: body.url ? body.url : ""
  });
  return await Image.find();
}

export async function findAllImage() {
  return await Image.find();
}

export async function findOneImage(id) {
  return await Image.findOne({ id: id });
}
