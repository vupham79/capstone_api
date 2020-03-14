import admin from "./admin";
import facebook from "./facebook";
import post from "./post";
import site from "./site";
import sitepath from "./sitepath";
import theme from "./theme";
import user from "./user";

export default app => {
  app.use("/theme", theme);
  app.use("/user", user);
  app.use("/site", site);
  app.use("/facebook", facebook);
  app.use("/admin", admin);
  app.use("/post", post);
  app.use("/sitePath", sitepath);
};
