import { Router } from "express";
import passport from "../authentication/passport";

const router = Router();

router.get(
  "/",
  passport.authenticate("facebook", {
    scope: ["public_profile", "manage_pages", "pages_show_list"],
    session: false
  })
);

router.get(
  "/callback",
  passport.authenticate("facebook", {
    scope: ["public_profile", "manage_pages", "pages_show_list"],
    session: false
  }),
  (req, res) => {
    res.send(req.profile);
  }
);

export default router;
