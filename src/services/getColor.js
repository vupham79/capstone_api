import ColorThief from "color-thief";
import fs from "fs";
import onecolor from "onecolor";
import { storage } from "../utils/firebase";

export async function analyzeColor(name) {
  let colorThief = new ColorThief();
  console.log(body.url);
  storage
    .bucket("gs://capstoneproject1-26a40.appspot.com")
    .file(name)
    .getSignedUrl({
      action: "read",
      expires: "03-09-2491"
    })
    .then(signedUrls => console.log(signedUrls[0]))
    .catch(e => console.log("error: ", e));
  let rgb = colorThief.getColor(image);
  console.log(rgb);
  const rgbCode = "rgb( " + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"; // 'rgb(r, g, b)'
  const hex = onecolor(rgbCode).hex();
  console.log(hex);
  return rgb;
}
