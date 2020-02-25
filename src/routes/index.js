import auth from "./auth";
import facebook from "./facebook";
import readColor from "./readColor";
import site from "./site";
import theme from "./theme";
import user from "./user";

export default app => {
  console.log("abc");
  app.use("/theme", theme);
  app.use("/user", user);
  app.use("/auth", auth);
  app.use("/site", site);
  app.use("/facebook", facebook);
  app.use("/readColor", readColor);
};
