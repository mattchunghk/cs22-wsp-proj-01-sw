import express from "express";
import { client } from "../utils/db";

export const indexRoute = express.Router();

indexRoute.get("/", async (req, res) => {
  try {
    const eventResult = await client.query(
      "SELECT * from events ORDER BY created_at desc"
    );
    res.json(eventResult.rows);
    return;
  } catch (err) {
    console.log(err);
  }
});
