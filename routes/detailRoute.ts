import express, { Request, Response } from "express";
import { client } from "../utils/db";
// import { checkPassword, hashPassword } from "../utils/hash";
// import fetch from "cross-fetch";
// import crypto from "crypto";
// import { logger } from "../utils/logger";
// import { formParse } from "../utils/upload";

export const detailRoute = express.Router();

detailRoute.get("/event_id/:id", getDetail);

async function getDetail(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const events = await client.query(`select * from events where id = ${id} `);

    res.status(200).json(events.rows);
  } catch (error) {
    res.status(404).send(error);
  }
}
