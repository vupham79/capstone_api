import {
  getFacebookPageInfo,
  getFacebookPageToken,
  getFacebookPages,
  getPageImage,
  uploadPageImage,
  downloadPageImage
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
    "EAAMIaToJEsABAJamPcK1HTMjohvIlHBKs7Qm70o0nWjoxr4KJNlvhnKHd3cPVpHDcGcXGSSeslZBCdevMNVH2oV2EB8r745itylZAZCE2q5dhI3KPHWZC7PWhbNfTuvVm5FH0jUOwfKV98ZBOO8SCaGZCQP0fsVwYRtVYyyiw0e3wsConN3uckHxlAHwfYh5cZD"
  );
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.get("/pageImage/get/:id", async (req, res) => {
  const data = await getPageImage(req.params.id);
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send(data);
});

router.get("/pageImage/upload/:id", async (req, res) => {
  const data = await uploadPageImage(req.params.id);
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.get("/pageImage/download/:id", async (req, res) => {
  const data = await downloadPageImage(req.params.id);
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

export default router;
