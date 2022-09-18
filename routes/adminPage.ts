import express from "express";
import { Request, Response } from "express";
import { io } from "../app";
import { form } from "../utils/upload";
import { client } from "../utils/db";
import { isAdmin } from "../utils/isAdmin";

export const adminPageRoutes = express.Router();

//拎 users
adminPageRoutes.get("/user/admin", isAdmin, async (req, res) => {
  try {
    const admin_result = await client.query(
      /*sql*/ "select * from users order by username ;"
    );
    console.log(admin_result.rows);
    res.status(200).json(admin_result.rows);

    return;
  } catch (err) {
    console.log(err);
    res.status(404).send("Get Messages Fall");
    return;
  }
});

//改 user
adminPageRoutes.put("/user/update", isAdmin, async (req, res) => {
  try {
    const userUpdata = req.body.isAdmin;
    console.log(userUpdata);
    let index = req.body.index;
    // console.log(index);
    //check index 有冇野
    if (!index || !Number(index)) {
      res.status(400).json({ message: "index is not a number" });
      return;
    }

    await client.query(`update users set is_admin = $1 where id = $2`, [
      userUpdata,
      Number(index),
    ]);
    res.status(200).send("success");
    io.emit("new-user-update", { message: "New Amber update" });
    return;
  } catch (err: any) {
    console.log(err.message);
    return;
  }
});
