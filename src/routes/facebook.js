import {
  getFacebookPageInfo,
  getFacebookPageToken,
  getFacebookPages
} from "../actions/fbPage";
import { Router } from "express";

const router = Router();

router.get("/pageInfo", async (req, res) => {
  const data = await getFacebookPageInfo();
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.get("/pageToken", async (req, res) => {
  const data = await getFacebookPageToken();
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.get("/page", async (req, res) => {
  const data = await getFacebookPages(
    "EAAMIaToJEsABAFZAWJP6RxmCb1lf5pNJayNF9Iz8cQun0ZA9MIN4YHtieWZAIjSAspxDlkd7YMWm1FEk50zZCBFCoCRdvGUmXy5ITrJhU7YZAiq245t5z4ogfkaOyawdA0L725jaRXDzIKL0vcII6JSAvWnt8YYM8ZBj5Uw2vZBcJUyrb6IM5Kkd4G8QKSIxumjmlExBGJ5rgZDZD"
  );
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

export default router;
