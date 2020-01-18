import fs from "fs";
import ColorThief from "color-thief";
import onecolor from "onecolor";

let colorThief = new ColorThief();
let image = fs.readFileSync(
  "/Users/tiger/Desktop/FPWG/api/src/assets/logo.jpg"
);
let rgb = colorThief.getColor(image);
console.log(rgb);
var rgbCode = "rgb( " + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"; // 'rgb(r, g, b)'

var hex = onecolor(rgbCode).hex();
console.log(hex);
