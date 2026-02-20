import express from "express";
import { getFilteredMandiData } from "../services/agmarknet.service.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { district, market, commodity } = req.query;

  const records = getFilteredMandiData(district, market, commodity);

  res.json({ records });
});

export default router;