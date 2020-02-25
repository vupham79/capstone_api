var theme = await Theme.findOne({
  "categories.name": req.body.category
});
if (!theme) {
  var theme = await Theme.findOne();
}
const insertStatus = await insertSite(
  req.body.pageId,
  req.body.userId,
  {
    phone: data.phone ? data.phone : "",
    longitude: data.location ? data.location.longitude : "",
    latitude: data.location ? data.location.latitude : "",
    logo: data.picture ? data.picture.data.url : "",
    fontTitle: theme.fontTitle ? theme.fontTitle : "",
    fontBody: theme.fontBody ? theme.fontBody : "",
    color: theme.mainColor ? theme.mainColor : "",
    title: data.name ? data.name : "",
    address: data.single_line_address ? data.single_line_address : "",
    navItems: defaultNavItems ? defaultNavItems : [],
    username: req.body.profile.name ? req.body.profile.name : "",
    themeId: new mongoose.Types.ObjectId(theme._id)
  },
  session
).catch(error => console.log("site error"));
console.log(insertStatus.id);
if (insertStatus) {
  return res.status(200).send(insertStatus);
} else {
  return res.status(500).send({ error: "Insert failed!" });
}
