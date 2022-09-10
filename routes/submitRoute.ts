import express, { Request, Response } from "express";
import { client } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/hash";
import fetch from "cross-fetch";
import crypto from "crypto";
import { logger } from "../utils/logger";

export const submitRoute = express.Router();

submitRoute.get("/", submitGet);

function submitGet(req: Request, res: Response) {
  try {
    res.send("submit get success");
  } catch (error) {
    res.status(404).send(error);
  }
}
