import * as CategoryService from "../services/CategoryService";

export async function insert(req, res) {
  try {
    if (
      !req.body.name ||
      req.body.name === undefined ||
      req.body.name.replace(/\s/g, "") === ""
    ) {
      return res.status(400).send({ error: "Theme name must not be empty!" });
    }
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
    if (
      !req.body.name ||
      req.body.name === undefined ||
      req.body.name.replace(/\s/g, "") === ""
    ) {
      return res
        .status(400)
        .send({ error: "Category name must not be empty!" });
    }
    const update = await CategoryService.editCategory(
      req.params.id,
      req.body.name,
      req.body.picture
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

export async function deleteOne(req, res) {
  try {
    const result = await CategoryService.deleteCategory(req.params.id);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}
