import pg from "pg";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import XLSX from "xlsx";
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
async function main() {
  await client.connect();

  await client.query(` truncate USERS  restart identity CASCADE`);
  await client.query(` truncate EVENTS  restart identity CASCADE`);
  let workbook = XLSX.readFile("./database/data-demo.xlsx");
  let events: Event[] = XLSX.utils.sheet_to_json(workbook.Sheets["events"]);
  let users: User[] = XLSX.utils.sheet_to_json(workbook.Sheets["users"]);

  console.log(users);
  for (let user of users) {
    await client.query(
      "INSERT INTO users (usernames,password,is_admin) VALUES ($1,$2,$3)",
      [user.username, user.password, user.is_admin]
    );
  }
  console.log(events);

  for (let event of events) {
    await client.query(
      "INSERT INTO events (user_id,title,country,city,created_at,updated_at,introduction,budget,start_date,end_date,people_quota,is_sporty,is_luxury,is_relax,is_countryside) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)",
      [
        event.user_id,
        event.title,
        event.country,
        event.city,
        "Now()",
        "Now()",
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

  await client.end(); // close connection with the database
}
main();
