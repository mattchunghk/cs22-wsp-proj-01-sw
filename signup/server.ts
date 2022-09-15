import express, { Request, Response } from 'express'
import { client, connectDB } from './db'
// import env from './env'

let app = express()

connectDB()

async function getAllUsers(req: Request, res: Response) {
    let users = (await client.query('select * from users;')).rows
    console.table(users)
    res.json({
        data: users
    })
}

app.get('/products', getAllUsers)