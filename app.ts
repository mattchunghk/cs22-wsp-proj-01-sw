import express from "express";
import { Request, Response } from "express";
import expressSession from "express-session";
import { submitRoute } from "./routes/submitRoute";

const app = express();

app.get("/", startTest);
app.use("/submit", submitRoute);

function startTest(req: Request, res: Response) {
  try {
    res.send("homepage get success");
  } catch (error) {
    res.send(error);
  }
}

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
