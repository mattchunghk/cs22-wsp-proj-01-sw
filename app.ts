import express from "express";
import { Request, Response } from "express";
import expressSession from "express-session";
import { eventsSubmitRoute } from "./routes/eventsSubmitRoute";
import { detailPageRoute } from "./routes/detailPageRoute";
import { indexRoute } from "./routes/indexRoute";
import { uploadDir } from "./utils/upload";
import fs from "fs";
import { userRoutes } from "./routes/userRoute";
import dotenv from "dotenv";
import grant from "grant";
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

app.use("/user", userRoutes);
app.use("/submit", eventsSubmitRoute);
app.use("/detail", detailPageRoute);
app.use("/index", indexRoute);

fs.mkdirSync(uploadDir, { recursive: true });
declare module "express-session" {
  interface SessionData {
    name?: string;
    isloggedin?: boolean;
    userId?: number | any;
    isAdmin?: boolean;
    grant?: any;
    user: any;
  }
}
dotenv.config();

const grantExpress = grant.express({
  defaults: {
    origin: "http://localhost:8080",
    transport: "session",
    state: true,
  },
  google: {
    key: process.env.GOOGLE_CLIENT_ID || "",
    secret: process.env.GOOGLE_CLIENT_SECRET || "",
    scope: ["profile", "email"],
    callback: "/user/login/google",
  },
});

app.use(grantExpress as express.RequestHandler);

app.use("/", express.static("public"));
app.use("/asset", express.static("asset"));
app.use("/submit", express.static("eventsForm"));
app.use("/detail", express.static("detailPage"));
app.use("/user", express.static("loginPage"));
app.use(express.static("uploads"));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
