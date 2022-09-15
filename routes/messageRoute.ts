import express from "express";
import { Request, Response } from "express";
import { io } from "../app";
import { form } from "../utils/upload";
import { client } from "../utils/db";

export const messageRoutes = express.Router();
//寫留言
messageRoutes.post("/create/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);
  try {
    form.parse(req, async (err, fields, files) => {
      let imageName: any = null;
      let messageHeading: any = fields.messages_heading;
      let messageContent: any = fields.messages_comment;
      const messages_comment_result = await client.query(
        /*sql*/ `INSERT INTO messages (heading,comment,user_id,event_id) VALUES ($1,$2,$3,$4) RETURNING id`,
        [messageHeading, messageContent, req.session.userId, id]
      );
      console.log(messages_comment_result);
      const messagesId = messages_comment_result.rows[0].id;
      // let file = Array.isArray(files.images_upload) ? files.images_upload[0] : files.images_upload;
      let messages_images_result;
      if (Array.isArray(files.images_upload)) {
        for (let i = 0; i < files.images_upload.length; i++) {
          let file: any = files.images_upload[i].newFilename;
          // console.log(files.images_upload[i].newFilename);
          imageName = file ? file : null;
          messages_images_result = await client.query(
            /*sql*/ `INSERT INTO message_images (filename,message_id) VALUES ($1,$2) RETURNING id`,
            [imageName, messagesId]
          );
        }
      } else if (files.images_upload) {
        let file: any = files.images_upload.newFilename;
        imageName = file ? file : null;
        messages_images_result = await client.query(
          /*sql*/ `INSERT INTO message_images (filename,message_id) VALUES ($1,$2) RETURNING id`,
          [imageName, messagesId]
        );
      }

      console.log({
        messagesId,
        imageName,
        messageHeading,
        messageContent,
      });
      io.emit("new-message", { message: "New Memo Added" });
      // io.broadcast.emit('message', "this is a test");

      console.log(messages_images_result?.rows);

      res.status(200).send("Upload message success");
      return;
    });
  } catch (err) {
    res.status(404).send("Create Messages Fall");
    return;
  }
});
//拎 messages
messageRoutes.get("/get/:id", async (req, res) => {
  const id = req.params.id;
  try {
    //拎 messages 加photos 加 like 3個table合併
    const messages_comment_result =
      await client.query(/*sql*/ `with favorite_count as ( select messages.id, count('messages.id') as favorite_count from messages left join user_favorite_messages on messages.id = user_favorite_messages.message_id group by messages.id ) 
        select messages.*, favorite_count.favorite_count, message_images.filename from messages 
        left join favorite_count on messages.id = favorite_count.id
        left join message_images on messages.id = message_images.message_id
        where event_id = ${id}
        order by id desc;`);
    const messages = messages_comment_result.rows;
    console.log(messages_comment_result.rows);
    // console.log(messages_comment_result);
    //拎 messages 加photos 兩個table合併
    // const messages_comment_result = await client.query(/*sql*/'SELECT messages.*, message_images.filename from messages left join message_images on messages.id = message_images.message_id ORDER BY messages.id desc');
    // const messages = messages_comment_result.rows
    let targetId = 0;
    let newMessages = messages.map((msg, index) => {
      if (targetId == msg.id) {
        return;
      }
      targetId = msg.id;
      let images: string[] = [];

      for (const message of messages) {
        const messageId = message.id;
        const filename = message.filename;
        if (msg.id == messageId) {
          images.push(filename);
        }
      }
      return { ...msg, images: images };
    });
    newMessages = newMessages.filter((msgObj) => {
      return msgObj;
    });
    // console.log(newMessages)
    res.status(200).json(newMessages);
    return;
  } catch (err) {
    console.log(err);
    res.status(404).send("Get Messages Fall");
    return;
  }
});
//拎 images
messageRoutes.get("/message_images/get", async (req, res) => {
  try {
    const messages_images_result = await client.query(
      /*sql*/ "SELECT * from message_images"
    );
    res.status(200).send(messages_images_result.rows);
    return;
  } catch (err) {
    res.status(404).send("Get Messages Images Fall");
    return;
  }
});
//拎 like數
messageRoutes.get("/message_like/get", async (req, res) => {
  try {
    let index = req.body.index;
    const messages_like_result = await client.query(
      /*sql*/ `SELECT count(*) from user_favorite_messages WHERE message_id = 56`
    );
    console.log(messages_like_result);

    res.status(200).send(messages_like_result.rows);
    return;
  } catch (err) {
    console.log(err);
    res.status(404).send("Get Messages Like Fall");
    return;
  }
});

//update message
messageRoutes.put("/update", async (req, res) => {
  try {
    const messageCommentUpdata = req.body.messages_comment;
    // console.log(messageCommentUpdata);
    let index = req.body.index;
    // console.log(index);
    //check index 有冇野
    if (!index || !Number(index)) {
      res.status(400).json({ message: "index is not a number" });
      return;
    }

    await client.query(`update messages set comment = $1 where id = $2`, [
      messageCommentUpdata,
      Number(index),
    ]);
    res.status(200).send("success");

    io.emit("new-message-update", { message: "New message update" });
    return;
  } catch (err: any) {
    console.log(err.message);
    return;
  }
});

//Delete message
messageRoutes.delete("/update", async (req, res) => {
  try {
    let index = req.body.index;
    // console.log(index);
    // check index 有冇野
    if (!index || !Number(index)) {
      res.status(400).json({ message: "index is not a number" });
      return;
    }
    await client.query(
      "delete from user_favorite_messages where message_id = $1",
      [Number(index)]
    );
    await client.query("delete from message_images where message_id = $1", [
      Number(index),
    ]);
    await client.query("delete from messages where id = $1", [Number(index)]);

    res.status(200).send("success");
    io.emit("message-delete", { message: "Message delete" });
    return;
  } catch (err: any) {
    console.log(err.message);
    return;
  }
});

//like message
messageRoutes.post("/like", async (req, res) => {
  try {
    let index = req.body.index;
    console.log(index);
    console.log("1");

    let userId;
    // check index 有冇野
    if (!index || !Number(index)) {
      res.status(400).json({ message: "index is not a number" });
      return;
    }
    //check login
    // if (req.session.user) {
    //     userId = req.session.user.userId
    // } else {
    //     return res.status(400).json({ Message: "Please login first" })
    // }

    let checkLikeResult = await client.query(
      /*sql*/ `SELECT * FROM user_favorite_messages WHERE message_id=($1)`,
      [Number(index)]
    );
    console.log(checkLikeResult.rowCount);
    console.log("1");
    // let like_result = await client.query(/*sql*/`INSERT INTO user_favorite_messages (user_id,message_id) VALUES ($1,$2) RETURNING id`, [null, Number(index)]);
    // // console.log(like_result.rowCount);
    // let delete_like = await client.query('delete from user_favorite_messages where message_id = $1', [Number(index)]);

    if (checkLikeResult.rowCount > 0) {
      await client.query(
        /*sql*/ `delete from user_favorite_messages where message_id = $1`,
        [Number(index)]
      );
    } else {
      await client.query(
        /*sql*/ `INSERT INTO user_favorite_messages (message_id) VALUES ($1) RETURNING id`,
        [Number(index)]
      );
    }

    res.status(200).send("success");
    return;
  } catch (err: any) {
    console.log(err.message);
    return;
  }
});
