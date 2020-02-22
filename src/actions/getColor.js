import ColorThief from "color-thief";
import fs from "fs";
import onecolor from "onecolor";

function readColor(body) {
  let colorThief = new ColorThief();
  console.log(body.url);
  let image = fs.readFileSync(
    // "/Users/tiger/Desktop/FPWG/api/src/assets/logo.jpg"
    body.url
  );
  let rgb = colorThief.getColor(image);
  console.log(rgb);
  const rgbCode = "rgb( " + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"; // 'rgb(r, g, b)'
  const hex = onecolor(rgbCode).hex();
  console.log(hex);
  return rgb;
}

export default readColor;
