import theme from "./theme";
import image from "./image";
import user from "./user";
import video from "./video";
import post from "./post";
import site from "./site";
import homePageImage from "./homePageImage";
import suggestedColor from "./suggestedColor";
import facebook from "./facebook";
import readColor from "./readColor";
import auth from "./auth";

export default app => {
  app.use("/theme", theme);
  app.use("/image", image);
  app.use("/video", video);
  app.use("/user", user);
  app.use("/auth", auth);
  app.use("/suggestedColor", suggestedColor);
  app.use("/site", site);
  app.use("/post", post);
  app.use("/homePageImage", homePageImage);
  app.use("/facebook", facebook);
  app.use("/readColor", readColor);
};
