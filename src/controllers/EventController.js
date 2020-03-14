import * as EventService from "../services/EventService";

export async function insert(req, res) {
  try {
    const insert = await EventService.insertEvent(req.params.id, req.body);
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
    const update = await EventService.editEvent(req.params.id, req.body);
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
    const find = await EventService.findOneEvent(req.params.id);
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
    const find = await EventService.findAllEvent();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}
