import express from "express";
import { client } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/hash";
import path from "path";

export const userRoutes = express.Router();

userRoutes.get("/", async (req, res) => {
  // res.json(userResult.rows);
  const dir = path.resolve("./loginPage/login.html");
  res.sendFile(dir);
});

userRoutes.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.status(400).json({
        message: "Invalid username or password",
      });
      return;
    }

    //check duplicates
    //let xxx = await xxx
    //use dbeaver to check

    let hashedPassword = await hashPassword(password);
    await client.query(
      `insert into users (username, password) values ($1, $2)`,
      [username, hashedPassword]
    );
    res.json({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRoutes.post("/login", async (req, res) => {
  console.log("userRoutes - [/login]");
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({
      message: "Invalid username or password",
    });
    return;
  }

  let userResult = await client.query(
    `select * from users where username = $1`,
    [username]
  );
  let dbuser = userResult.rows[0];
  console.log("dbuser =", dbuser);

  if (!dbuser) {
    res.status(400).json({
      message: "Invalid username or password",
    });
    return;
  }

  //compare password
  let isMatched = await checkPassword(password, dbuser.password);
  if (!isMatched) {
    res.status(400).json({
      message: "Invalid username or password",
    });
    return;
  }

  req.session["isloggedin"] = true;
  req.session["name"] = username;
  req.session["userId"] = dbuser.id;
  req.session["isAdmin"] = dbuser.is_admin;
  console.log("Login successful");
  res.status(200).json({
    message: "Success login",
  });
});
