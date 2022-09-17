import express, { Request, Response } from "express";
import { client } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/hash";
import fetch from "cross-fetch";
import crypto from "crypto";
import { logger } from "../utils/logger";
import { formParse } from "../utils/upload";
import path, { resolve } from "path";
import { isLoggedIn } from "../utils/isLoggedIn";
import { request } from "http";

export const detailPageRoute = express.Router();

//? /detail
detailPageRoute.get("/event_id/:id", getDetail);
detailPageRoute.get("/detailPage/id/:id", goDetailPage);
detailPageRoute.post("/join", isLoggedIn, joinEvent);
detailPageRoute.get("/joinCount", joinCount);
detailPageRoute.get("/totalLoveCount/:id", totalLoveCount);
detailPageRoute.delete("/delete/:id", isLoggedIn, deleteEvents);
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
  console.log("event_id= ", id);
  try {
    const events = await client.query(
      `select * from event_images INNER JOIN events ON event_images.event_id = events.id where events.id = ${id};`
    );
    // console.log("events= ", events.rows);
    res.status(200).json({ data: events.rows });
    // res.status(200).json(events.rows);
  } catch (error) {
    res.status(404).send(error);
  }
}

async function joinEvent(req: Request, res: Response) {
  const eventId: any = req.query.eventId;
  try {
    const eventCounts = await client.query(
      // `SELECT count(*) FROM event_participants WHERE event_id=${eventId} and user_id = ${req.session.useId};`
      `SELECT count(*) FROM event_participants WHERE event_id=${eventId} and user_id = ${req.session.userId};`
    );

    if (parseInt(eventCounts.rows[0].count) == 0) {
      await client.query(
        `INSERT INTO event_participants (user_id, event_id) VALUES ($1,$2)`,
        [req.session.userId, eventId]
      );
    } else {
      await client.query(
        `DELETE FROM event_participants WHERE event_id=${eventId} and user_id = ${req.session.userId};`
      );
    }
    res.status(200).json(eventCounts.rows[0]);
  } catch (error) {
    res.status(404).send(error);
  }
}

async function joinCount(req: Request, res: Response) {
  const eventId: any = req.query.eventId;

  try {
    if (req.session.userId != undefined) {
      const userJoined = await client.query(
        `SELECT count(*) FROM event_participants WHERE event_id=${eventId} and user_id = ${req.session.userId};`
      );
      const eventJoinCounts = await client.query(
        `SELECT count(*) FROM event_participants WHERE event_id=${eventId};`
      );
      res.status(200).json([userJoined.rows[0], eventJoinCounts.rows[0]]);
    } else {
      const eventJoinCounts = await client.query(
        `SELECT count(*) FROM event_participants WHERE event_id=${eventId};`
      );
      res.status(200).json([false, eventJoinCounts.rows[0]]);
    }
  } catch (error) {
    res.status(404).send(error);
  }
}

async function deleteEvents(req: Request, res: Response) {
  const id = req.params.id;
  console.log(`deleting ${id}`);
  try {
    await client.query(`
    DELETE FROM user_favorite_messages WHERE message_id in (select id from messages WHERE event_id = ${id});
    DELETE FROM message_images WHERE message_id in (select id from messages WHERE event_id = ${id});
    DELETE FROM messages WHERE event_id = ${id};
    DELETE FROM event_images WHERE event_id = ${id};
    DELETE FROM event_participants WHERE event_id = ${id};
    DELETE FROM favorite_events WHERE event_id = ${id};
    DELETE FROM events WHERE id = ${id};
    `);
    res.status(200).json({ message: "Delete Events successfully" });
  } catch (error) {
    res.status(404).send(error);
  }
}

async function totalLoveCount(req: Request, res: Response) {
  const id = req.params.id;
  try {
    let totalLoveResult = await client.query(`
    SELECT count(*) FROM favorite_events WHERE event_id = ${id};
    `);
    res.status(200).json(totalLoveResult.rows[0]);
  } catch (error) {
    res.status(404).send(error);
  }
}

detailPageRoute.post("/love", isLoggedIn, async (req, res) => {
  const userID = req.session["userId"] || "";
  const eventID = req.body.eventIndex;
  console.log("EventIndex= " + eventID);
  try {
    let userLIkeStatus = await client.query(
      `Select * FROM favorite_events
      where user_id =($1) and event_id=($2)`,
      [userID, eventID]
    );
    console.log(userLIkeStatus);
    if (userLIkeStatus.rowCount > 0) {
      await client.query(
        /*sql*/ `DELETE FROM favorite_events
    where user_id =($1) and event_id=($2)`,
        [userID, eventID]
      );
    } else {
      await client.query(
        `INSERT INTO favorite_events (user_id, event_id) VALUES ($1,$2)`,
        [userID, eventID]
      );
    }
    res.status(200).send("success");
    return;
  } catch (err: any) {
    logger.error(err);
    res.status(400).send(err.message);
    return;
  }
});

detailPageRoute.get("/event_id/:eventId/count", async (req, res) => {
  const userId = req.session?.userId || "1";
  const eventId = req.params.eventId;
  console.log({ userId });
  console.log({ eventId });

  try {
    let eventLovedbyUser = await client.query(
      `SELECT count(*) FROM favorite_events WHERE event_id=${eventId} and user_id=${userId};`
    );
    const count = eventLovedbyUser.rows[0].count;
    // await client.query(
    //   /*sql*/ `Update favorite_events set count=($1) WHERE id=($2)`,
    //   [eventLikeStatus.rowCount, eventID]
    // );
    console.log(eventLovedbyUser);

    res.status(200).json({
      data: count,
    });
    return;
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});
