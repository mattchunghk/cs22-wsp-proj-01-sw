import express from "express";
import { Request, Response } from "express";
import expressSession from "express-session";
import { eventsSubmitRoute } from "./routes/eventsSubmitRoute";
import { detailPageRoute } from "./routes/detailPageRoute";
import { indexRoute } from "./routes/indexRoute";
import { uploadDir } from "./utils/upload";
import fs from "fs";
import { userRoutes } from "./routes/userRoute";
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
app.use("/user", userRoutes);
app.use("/submit", eventsSubmitRoute);
app.use("/detail", detailPageRoute);
app.use("/index", indexRoute);

fs.mkdirSync(uploadDir, { recursive: true });
declare module "express-session" {
  interface SessionData {
    name?: string;
    isloggedin?: boolean;
    userId?: number;
    isAdmin?: boolean;
  }
}

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
app.use("/user", express.static("loginPage"));
app.use("/user", express.static("signup"));
app.use(express.static("uploads"));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
