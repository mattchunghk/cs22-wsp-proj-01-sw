import express, { Request, Response } from "express";
import { client } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/hash";
import fetch from "cross-fetch";
import crypto from "crypto";
import { logger } from "../utils/logger";
import { formParse } from "../utils/upload";
import path from "path";

export const detailPageRoute = express.Router();

detailPageRoute.get("/event_id/:id", getDetail);
detailPageRoute.get("/detailPage/id/:id", goDetailPage);
detailPageRoute.post("/join", joinEvent);
detailPageRoute.get("/joinCount", joinCount);
// Query
//localhost:8080/detail/detailPage.html?id=2

// Params
//localhost:8080/detail/detailPage/2

// Params
async function goDetailPage(req: Request, res: Response) {
  const dir = path.resolve("./detailPage/detailPage.html");
  res.sendFile(dir);
}

async function getDetail(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const events = await client.query(
      `select * from event_images INNER JOIN events ON event_images.event_id = events.id where events.id = ${id};`
    );

    res.status(200).json(events.rows);
  } catch (error) {
    res.status(404).send(error);
  }
}

let userId = 2;
async function joinEvent(req: Request, res: Response) {
  const eventId: any = req.query.eventId;
  try {
    const eventCounts = await client.query(
      // `SELECT count(*) FROM event_participants WHERE event_id=${eventId} and user_id = ${req.session.useId};`
      `SELECT count(*) FROM event_participants WHERE event_id=${eventId} and user_id = ${userId};`
    );

    if (parseInt(eventCounts.rows[0].count) == 0) {
      await client.query(
        `INSERT INTO event_participants (user_id, event_id) VALUES ($1,$2)`,
        [userId, eventId]
      );
    } else {
      await client.query(
        `DELETE FROM event_participants WHERE event_id=${eventId} and user_id = ${userId};`
      );
    }
    res.status(200).json(eventCounts.rows[0]);
  } catch (error) {
    res.status(404).send(error);
  }
}

async function joinCount(req: Request, res: Response) {
  const eventId: any = req.query.eventId;
  // const userId: any = req.query.userId;
  try {
    const userJoined = await client.query(
      `SELECT count(*) FROM event_participants WHERE event_id=${eventId} and user_id = ${userId};`
    );
    const eventJoinCounts = await client.query(
      `SELECT count(*) FROM event_participants WHERE event_id=${eventId};`
    );

    res.status(200).json([userJoined.rows[0], eventJoinCounts.rows[0]]);
  } catch (error) {
    res.status(404).send(error);
  }
}

detailPageRoute.post("/love", async (req, res) => {
  try {
    res.status(200).json({});
    return;
  } catch (err: any) {
    logger.error(err);
    res.status(400).send(err.message);
    return;
  }
});
