import auth from "./auth";
import facebook from "./facebook";
import site from "./site";
import theme from "./theme";
import user from "./user";
import admin from "./admin";
import post from "./post";
import sitepath from "./sitepath";

export default app => {
  app.use("/theme", theme);
  app.use("/user", user);
  app.use("/auth", auth);
  app.use("/site", site);
  app.use("/facebook", facebook);
  app.use("/admin", admin);
  app.use("/post", post);
  app.use("/sitePath", sitepath);
};
