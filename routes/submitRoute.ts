import express, { Request, Response } from "express";
import { client } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/hash";
import fetch from "cross-fetch";
import crypto from "crypto";
import { logger } from "../utils/logger";
import { formParse } from "../utils/upload";

//! "/submit"
export const submitRoute = express.Router();

submitRoute.get("/", submitGet);
submitRoute.post("/formidable/", getSubmitData);

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

    const {
      filename1: images1,
      filename2: images2,
      filename3: images3,
      title: title,
      startDate: startDate,
      endDate: endDate,
      // fromSocketId
    } = await formParse(req);

    console.log(images1, images2, images3, title, startDate, endDate);

    res.json({
      message: "Upload successful",
    });
  } catch (error) {
    res.status(404).send(error);
  }
}
