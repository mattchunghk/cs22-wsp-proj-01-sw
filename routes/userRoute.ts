import express from "express";
import { client } from "../utils/db";
import { checkPassword, hashPassword } from "../utils/hash";
import path from "path";

export const userRoutes = express.Router();

//! /user
userRoutes.get("/", goLoginPage);
userRoutes.post("/login", login);
userRoutes.get("/logout", logout);
userRoutes.get("/login/google", loginGoogle);
userRoutes.post("/register", register);
userRoutes.get("/loginStatus", loginStatus);

async function goLoginPage(req: express.Request, res: express.Response) {
  // res.json(userResult.rows);
  const dir = path.resolve("./loginPage/login.html");
  res.sendFile(dir);
}

async function register(req: express.Request, res: express.Response) {
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
}

async function login(req: express.Request, res: express.Response) {
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
}

async function loginGoogle(req: express.Request, res: express.Response) {
  try {
    const accessToken = (req.session?.grant as any).response.access_token;
    const fetchRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await fetchRes.json();
    console.log(result);

    const users = (
      await client.query(`SELECT * FROM users WHERE users.username = $1`, [
        result.email,
      ])
    ).rows;
    let user = users[0];
    if (!user) {
      //create a 32bit crypto password

      console.log(user);
      let password = await hashPassword(result.email);
      console.log(password);
      user = (
        await client.query(
          `INSERT INTO users (username,password)
	            VALUES ($1,$2) RETURNING *`,
          [result.email, password]
        )
      ).rows[0];
    }
    if (req.session) {
      req.session.name = user.username;
      req.session.isloggedin = true;
      req.session.userId = user.id;
      req.session["user"] = result;
    }
    return res.redirect("/");
  } catch (error) {
    res.status(401).send("Invalid credentials");
  }
}

async function logout(req: express.Request, res: express.Response) {
  try {
    req.session.destroy(() => {
      console.log("user logged out");
    });

    res.status(200).json({
      message: "Success logout",
    });
  } catch (error) {
    res.status(400).json({
      message: "logout error",
    });
  }
}

async function loginStatus(req: express.Request, res: express.Response) {
  try {
    console.log(req.session);

    res.status(200).json(req.session);
  } catch (error) {
    res.status(400).json({
      message: "get status error",
    });
  }
}
