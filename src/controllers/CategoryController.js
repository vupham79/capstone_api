import * as CategoryService from "../services/CategoryService";

export async function insert(req, res) {
  try {
    const insert = await CategoryService.insertCategory(req.body);
    if (insert) {
      return res.status(200).send(insert);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function update(req, res) {
  try {
    const update = await CategoryService.editCategory(
      req.params.id,
      req.body.name
    );
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
    const find = await CategoryService.findOneCategory(req.params.id);
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
    const find = await CategoryService.findAllCategory();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}