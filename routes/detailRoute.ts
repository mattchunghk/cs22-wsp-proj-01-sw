import express, { Request, Response } from "express";
import { client } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/hash";
import fetch from "cross-fetch";
import crypto from "crypto";
import { logger } from "../utils/logger";
import { formParse } from "../utils/upload";
import path from "path";

export const detailRoute = express.Router();

detailRoute.get("/event_id/:id", getDetail);

// Query
//localhost:8080/detail/detailPage.html?id=2

// Params
//localhost:8080/detail/detailPage/2

// Params
detailRoute.get("/detailPage/id/:id", (req, res) => {
  const dir = path.resolve("./detailPage/detailPage.html");
  res.sendFile(dir);
});

async function getDetail(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const events = await client.query(
      `select * from event_images INNER JOIN events ON event_images.event_id = events.id where events.id = ${id};`
    );

    console.log(events.rows);

    res.status(200).json(events.rows);
  } catch (error) {
    res.status(404).send(error);
  }
}

detailRoute.post("/love", async (req, res) => {
  try {
    res.status(200).json({});
    return;
  } catch (err: any) {
    logger.error(err);
    res.status(400).send(err.message);
    return;
  }
});
