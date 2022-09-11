import express, { Request, Response } from "express";
import { client } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/hash";
import fetch from "cross-fetch";
import crypto from "crypto";
import { logger } from "../utils/logger";
import { formParse } from "../utils/upload";

export const submitRoute = express.Router();

submitRoute.get("/", submitGet);
submitRoute.post("/formidable", getSubmitData);

function submitGet(req: Request, res: Response) {
  try {
    res.redirect("/submit/eventsForm.html");
  } catch (error) {
    res.status(404).send(error);
  }
}

async function getSubmitData(req: Request, res: Response) {
  try {
    console.log("post- formidable");

    const events = await client.query(
      "select * from events order by created_at DESC;"
    );

    res.status(200).json(events.rows);
    // const {
    //   filename: images,
    //   text: title,
    //   // fromSocketId
    // } = await formParse(req);

    // console.log(images, title);

    // res.json({
    //   message: "Upload successful",
    // });
    // res.send("Upload successful");
  } catch (error) {
    res.status(404).send(error);
  }
}
