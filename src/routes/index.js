import authRouter from "./auth";
import pageRouter from "./page";
import firebaseRouter from "./firebase";
import { getFirebaseStorage } from "../actions/firebase";
import theme from "./theme";
import image from "./image";
import user from "./user";
import video from "./video";
import navItem from "./navItem";
import post from "./post";
import site from "./site";
import homePageImage from "./homePageImage";
import suggestedColor from "./suggestedColor";
import facebook from "./facebook";
import bodyParser from "body-parser";
import readColor from "./readColor";

export default app => {
  app.use(bodyParser.json());
  // app.use("/auth/facebook", authRouter);
  // app.use("/page", pageRouter);
  app.use("/theme", theme);
  app.use("/image", image);
  app.use("/video", video);
  app.use("/user", user);
  app.use("/suggestedColor", suggestedColor);
  app.use("/site", site);
  app.use("/post", post);
  app.use("/navItem", navItem);
  app.use("/homePageImage", homePageImage);
  app.use("/facebook", facebook);
  app.use("/readColor", readColor);

  // app.get("/", (req, res) => {
  //   return res.send("<h1>Logged In</h1>");
  // });
  // app.post("/:id", (req, res) => {
  //   return res.send("<p>" + req.params.id + "</p>");
  // });
  // app.delete("/:id/:name", (req, res) => {
  //   return res.send("<p>" + JSON.stringify(req.params) + "</p>");
  // });
  // app.use("/firebase", firebaseRouter);
  //   app.get("/firebase", (req, res) => {
  //     getFirebaseStorage();
  //  });
};
