import * as SitepathService from "../services/SitepathService";

export async function findAll(req, res) {
  console.log("abc");
  try {
    const find = await SitepathService.findAll();
    console.log("Sitepath list: ", find.length);
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}
