import {
  insertTheme,
  editTheme,
  findOneTheme,
  findAllTheme,
} from "../services/ThemeService";

export async function insert(req, res) {
  try {
    if (
      !req.body.name ||
      req.body.name === undefined ||
      req.body.name.replace(/\s/g, "") === ""
    ) {
      return res.status(400).send({ error: "Theme name must not be empty!" });
    }
    const insert = await insertTheme(req.body);
    if (insert) {
      return res.status(200).send(insert);
    }
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
}

export async function update(req, res) {
  try {
    if (
      !req.body.name ||
      req.body.name === undefined ||
      req.body.name.replace(/\s/g, "") === ""
    ) {
      return res.status(400).send({ error: "Theme name must not be empty!" });
    }
    const update = await editTheme(req.params.id, req.body);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function findOne(req, res) {
  try {
    const find = await findOneTheme(req.params.id);
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function findAll(req, res) {
  try {
    const find = await findAllTheme();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}
