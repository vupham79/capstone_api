import express from "express";
import cors from "cors";
import canvas from "canvas";
import routes from "./src/routes";
import { connectDb } from "./src/models";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "./src/utils/passport";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
// parse application/json
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "https://fpwg.now.sh",
      "https://fpwg.netlify.com",
      "https://fpwg1.netlify.com",
      "https://fpwg.netlify.app",
      "https://fpwg1.netlify.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(cookieParser(process.env.secret));
routes(app);
// mongodb local
connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
