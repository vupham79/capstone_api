import User from "../models/User";

export async function authenticate(req, res, next) {
  const user = await User.findOne({
    id: req.params.userId || req.body.userId,
    accessToken: req.params.accessToken || req.body.accessToken
  });
  if (user) {
    next();
  } else {
    return res.status(500).send("Not authenticated!");
  }
}
