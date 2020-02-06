import authRouter from "./auth";
import pageRouter from "./page";

export default app => {
  app.use("/auth/facebook", authRouter);
  app.get("/page", pageRouter);
  app.get("/", (req, res) => {
    return res.send("<h1>Logged In</h1>");
  });
};
