const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  keyFilename: "./src/utils/service_account.json"
});

// example
//get file
// storage
//   .bucket("gs://capstoneproject1-26a40.appspot.com")
//   .file("Pagevamp.png")
//   .getSignedUrl({
//     action: "read",
//     expires: "03-09-2491"
//   })
//   .then(signedUrls => console.log(signedUrls[0]))
//   .catch(e => console.log("error: ", e));

// upload file
// storage
//   .bucket("gs://capstoneproject1-26a40.appspot.com")
//   .upload("./seed", { destination: "12333" });

export { storage };
