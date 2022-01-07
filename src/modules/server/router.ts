import { Router } from "express";
import Client from "../../business/client/main.client";
import Wish from "../../business/wish/main.wish";
import path from 'path';

const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '../../../../static/public/html/index.html'));
});

router.get("/statistics/:uuid", async (req, res) => {
  console.log(req.params.uuid)
  res.send(await new Wish(null).stats(req.params.uuid));
});

export default router;
