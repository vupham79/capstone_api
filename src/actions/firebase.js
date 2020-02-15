// import axios from "../utils/axios";
import axios from "axios";
require("dotenv").config();

export async function getFirebaseValue(
  imageName = "Untitled.png",
  alt = "media",
  token = "ca57a1a6-f9ca-41f3-859b-0f8a16f63015"
) {
  const url =
    "https://firebasestorage.googleapis.com/v0/b/" +
    "capstoneproject1-26a40.appspot.com" +
    "/o/" +
    imageName +
    "?" +
    "alt=" +
    alt +
    "&" +
    "token=" +
    token;
  console.log(url);
  // const data = await axios({
  //   url
  // });
  // return data;
  let data = "empty";
  await axios
    .get(url)
    .then(function(response) {
      console.log("Response status: " + response.status);
      // console.log("Image data: " + response.data);
      data = response.responseUrl;
    })
    .catch(function(error) {
      console.log(error);
    });
  return data;
}
