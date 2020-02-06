import path from "path";
import fs from "fs";
import express from "express";
import https from "https";
import cors from "cors";
import routes from "./src/routes";
import passport from "./src/utils/passport";
import { connectDb } from "./src/models";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

const certOptions = {
  key: fs.readFileSync(path.resolve("./src/cert/server.key")),
  cert: fs.readFileSync(path.resolve("./src/cert/server.crt"))
};

app.use(cors());
// passport
app.use(passport.initialize());
routes(app);
// mongodb local
connectDb();

var server = https.createServer(certOptions, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
