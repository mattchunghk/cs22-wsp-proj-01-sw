import express from "express";
import { Request, Response } from "express";
import expressSession from "express-session";

const app = express();

app.get("/", startTest);

function startTest(req: Request, res: Response) {
  try {
    res.send("success");
  } catch (error) {
    res.send(error);
  }
}

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
