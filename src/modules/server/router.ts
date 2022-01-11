import { Router } from "express";
import Wish from "../../business/wish/main.wish";
import path from 'path';

const router = Router();

router.get("/", (_, res) => {
  res.sendFile(path.join(__dirname + '../../../../static/public/html/index.html'));
});

router.get("/statistics/:uuid", async (req, res) => {
  res.send(await new Wish(null).stats(req.params.uuid));
});

export default router;
