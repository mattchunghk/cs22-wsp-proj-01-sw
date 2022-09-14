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

// Query
//localhost:8080/detail/detailPage.html?id=2

// Params
//localhost:8080/detail/detailPage/2

// Params
detailPageRoute.get("/detailPage/id/:id", (req, res) => {
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

detailPageRoute.post("/love", async (req, res) => {
  const userID = 2;
  req.session["userID"] || "";
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

    // let eventLikeStatus = await client.query(
    //   `Select * FROM favorite_events WHERE event_id=$1`,
    //   [eventID]
    // );

    // await client.query(
    //   /*sql*/ `Update favorite_events set count=($1) WHERE id=($2)`,
    //   [eventLikeStatus.rowCount, eventID]
    // );
    // console.log(eventLikeStatus);
    res.status(200).json({});
    return;
  } catch (err: any) {
    logger.error(err);
    res.status(400).send(err.message);
    return;
  }
});
