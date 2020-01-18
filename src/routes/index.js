import facebookRouter from "./facebook";

export default app => {
  app.use("/auth/facebook", facebookRouter);
  app.get("/page", (req, res) => {
    return res.send("<h1>success</h1>");
  });
  app.get("/", (req, res) => {
    return res.send("<h1>Logged In</h1>");
  });
};
