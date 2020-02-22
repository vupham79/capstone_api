import auth from "./auth";
import facebook from "./facebook";
import homePageImage from "./homePageImage";
import image from "./image";
import post from "./post";
import readColor from "./readColor";
import site from "./site";
import theme from "./theme";
import user from "./user";
import video from "./video";

export default app => {
  app.use("/theme", theme);
  app.use("/image", image);
  app.use("/video", video);
  app.use("/user", user);
  app.use("/auth", auth);
  app.use("/site", site);
  app.use("/post", post);
  app.use("/homePageImage", homePageImage);
  app.use("/facebook", facebook);
  app.use("/readColor", readColor);
};
