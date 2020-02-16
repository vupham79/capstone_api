import express from "express";
import cors from "cors";
import routes from "./src/routes";
import { connectDb } from "./src/models";
import bodyParser from "body-parser";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

routes(app);
// mongodb local
connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
