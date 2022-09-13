import pg from "pg";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import XLSX from "xlsx";
import { hashPassword } from "../utils/hash";
// import { hashPassword } from '../utils/hash'

const client = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

interface Event {
  id: number;
  user_id: number;
  title: string;
  country: string;
  city: string;
  introduction: string;
  budget: number;
  start_date: number;
  end_date: number;
  people_quota: number;
  is_sporty: Boolean;
  is_luxury: Boolean;
  is_relax: Boolean;
  is_countryside: Boolean;
}

interface User {
  username: string;
  password: string;
  is_admin: boolean;
}

interface Messages {
  comment: string;
  user_id: string;
  event_id: boolean;
}
async function main() {
  await client.connect();

  await client.query(` truncate USERS  restart identity CASCADE`);
  await client.query(` truncate EVENTS  restart identity CASCADE`);
  await client.query(` truncate MESSAGES restart identity CASCADE`);
  let workbook = XLSX.readFile("./database/data-demo.xlsx");
  let events: Event[] = XLSX.utils.sheet_to_json(workbook.Sheets["events"]);
  let users: User[] = XLSX.utils.sheet_to_json(workbook.Sheets["users"]);
  let messages: Messages[] = XLSX.utils.sheet_to_json(
    workbook.Sheets["messages"]
  );

  console.log(users);
  for (let user of users) {
    let hashedPassword = await hashPassword(user.password);
    await client.query(
      "INSERT INTO users (username,password,is_admin) VALUES ($1,$2,$3)",
      [user.username, hashedPassword, user.is_admin]
    );
  }
  console.log(events);

  for (let event of events) {
    await client.query(
      "INSERT INTO events (user_id,title,country,city,introduction,budget,start_date,end_date,people_quota,is_sporty,is_luxury,is_relax,is_countryside) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
      [
        event.user_id,
        event.title,
        event.country,
        event.city,
        event.introduction,
        event.budget,
        event.start_date,
        event.end_date,
        event.people_quota,
        event.is_sporty,
        event.is_luxury,
        event.is_relax,
        event.is_countryside,
      ]
    );
  }

  console.log(messages);

  for (let message of messages) {
    await client.query(
      "INSERT INTO messages (comment,user_id,event_id) VALUES ($1,$2,$3)",
      [message.comment, message.user_id, message.event_id]
    );
  }

  await client.end(); // close connection with the database
}
main();
