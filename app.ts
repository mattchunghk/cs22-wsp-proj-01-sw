import express from "express";
import { Request, Response } from "express";
import expressSession from "express-session";
import { submitRoute } from "./routes/submitRoute";
import { detailRoute } from "./routes/detailRoute";
import { indexRoute } from "./routes/indexRoute";
import { uploadDir } from "./utils/upload";
import fs from "fs";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  expressSession({
    secret: "Tecky Academy teaches typescript",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", startTest);
app.use("/submit", submitRoute);
app.use("/detail", detailRoute);
app.use("/index", indexRoute);

fs.mkdirSync(uploadDir, { recursive: true });

function startTest(req: Request, res: Response) {
  try {
    res.redirect("index.html");
  } catch (error) {
    res.send(error);
  }
}
app.use("/", express.static("public"));
app.use("/asset", express.static("asset"));
app.use("/submit", express.static("eventsForm"));
app.use("/detail", express.static("detailPage"));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
