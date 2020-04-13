import {
  insertTheme,
  editTheme,
  findOneTheme,
  findAllTheme,
  deleteTheme,
} from "../services/ThemeService";

export async function insert(req, res) {
  try {
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

export async function deleteOne(req, res) {
  try {
    const deleteOne = await deleteTheme(req.params.id);
    if (deleteOne) {
      return res.status(200).send(deleteOne);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}
