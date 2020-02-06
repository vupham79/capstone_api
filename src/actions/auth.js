import passport from "../utils/passport";

export const authFB = passport.authenticate("facebook", {
  scope: ["public_profile", "manage_pages", "pages_show_list"],
  session: false
});

export const authFBCallback = passport.authenticate("facebook", {
  scope: ["public_profile", "manage_pages", "pages_show_list"],
  session: false
});
