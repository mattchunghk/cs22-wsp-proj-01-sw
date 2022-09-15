import express from "express";
import expressSession from "express-session";

import { format, fromUnixTime } from "date-fns"
// import jsonfile from "json-file";
import formidable from "formidable";
import fs from "fs";
import { Client } from "pg";
import dotenv from "dotenv";

import http from 'http';
import { Server as SocketIO } from 'socket.io';
import { messageRoutes } from "./routes/messageRoute";


dotenv.config();

export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

client.connect();


const uploadDir = "uploads"
fs.mkdirSync(uploadDir, { recursive: true });

const app = express();
const server = new http.Server(app);
export const io = new SocketIO(server);


app.use(express.json())
app.use(express.urlencoded())


export const newForm = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: true,
    maxFiles: 6,
    maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
    filter: part => part.mimetype?.startsWith("image/") || false,
    filename: (name, ext, part, form) => {
        let newName = format(new Date(), 'yyyy-MM-dd HH:mm:ss') + name + ext
        return newName
    }
});




// const form = formidable({
//     uploadDir,
//     keepExtensions: true,
//     maxFiles: 6,
//     maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
//     filter: part => part.mimetype?.startsWith("image/") || false,
//     filename: (name, ext, part, form) => {
//         let newName = format(new Date(), 'yyyy-MM-dd HH:mm:ss') + name + ext
//         return newName
//     },
// })




app.use(
    expressSession({
        secret: 'key.tecky.io',
        resave: true,
        saveUninitialized: true,
    }),
)

declare module 'express-session' {
    interface SessionData {
        name?: string
        loggedin?: boolean
    }
}

app.use('/', messageRoutes)






app.use(express.static('uploads'))
app.use(express.static('public')) // auto to do next()
app.use(express.static('error'))


// app.use((req, res, next) => {
//     res.sendFile(path.resolve("./error/404.html"))
// })


io.on('connection', function (socket) {
    console.log("new socket");
});

server.listen(8080, () => {
    console.log('listening on port 8080')
})