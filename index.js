import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";
import routes from "./src/routes";
import passport from "./src/utils/passport";
import { connectDb } from "./src/models";
import bodyParser from "body-parser";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());
// passport
app.use(passport.initialize());
routes(app);
// mongodb local
connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
