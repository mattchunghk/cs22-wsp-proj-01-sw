import express from 'express'
import { Request, Response } from 'express'
import expressSession from 'express-session'
import { eventsSubmitRoute } from './routes/eventsSubmitRoute'
import { detailPageRoute } from './routes/detailPageRoute'
import { indexRoute } from './routes/indexRoute'
import { uploadDir } from './utils/upload'
import fs from 'fs'
import { userRoutes } from './routes/userRoute'
import dotenv from 'dotenv'
import grant from 'grant'
import http from 'http'
import { Server as SocketIO } from 'socket.io'
import { format, fromUnixTime } from 'date-fns'
import { Server } from 'http'
import { messageRoutes } from './routes/messageRoute'
import { adminPageRoutes } from './routes/adminPage'

import { client } from './utils/db'
dotenv.config()

const app = express()
const server = new http.Server(app)
export const io = new SocketIO(server)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
	expressSession({
		secret: 'Tecky Academy teaches typescript',
		resave: true,
		saveUninitialized: true
	})
)

app.use('/messages', messageRoutes)
app.use('/user', userRoutes)
app.use('/submit', eventsSubmitRoute)
app.use('/detail', detailPageRoute)
app.use('/index', indexRoute)
app.use('/', adminPageRoutes)

fs.mkdirSync(uploadDir, { recursive: true })
// deletedImg() // delete Images not found in database
declare module 'express-session' {
	interface SessionData {
		name?: string
		isloggedin?: boolean
		userId?: number | any
		isAdmin?: boolean
		grant?: any
		user?: any
		createAt?: any
	}
}

const grantExpress = grant.express({
	defaults: {
		origin: 'https://joinmego.mattchung.one',
		transport: 'session',
		state: true
	},
	google: {
		key: process.env.GOOGLE_CLIENT_ID || '',
		secret: process.env.GOOGLE_CLIENT_SECRET || '',
		scope: ['profile', 'email'],
		callback: '/user/login/google'
	}
})

export async function deletedImg() {
	let dbFileNames: any = []

	let eventImages = await client.query(`
		select filename from event_images;
    `)
	let messageImages = await client.query(`
	select filename from message_images;
`)

	for (let eventImage of eventImages.rows) {
		dbFileNames.push(eventImage.filename)
	}
	for (let messageImage of messageImages.rows) {
		dbFileNames.push(messageImage.filename)
	}

	let files = fs.readdirSync('./uploads')

	for (let file of files) {
		if (fs.existsSync(`./uploads/${file}`)) {
			if (!dbFileNames.includes(file)) {
				fs.unlink(`./uploads/${file}`, (err) => {
					if (err) throw err
					console.log(`./uploads/${file} was deleted`)
				})
			}
		}
	}
}

app.use(grantExpress as express.RequestHandler)

app.use('/', express.static('public'))
app.use('/asset', express.static('asset'))
app.use('/submit', express.static('eventsForm'))
app.use('/detail', express.static('detailPage'))
app.use('/user', express.static('loginPage'))
app.use('/user', express.static('register'))
app.use('/user', express.static('userInfo'))
app.use(express.static('uploads'))
app.use(express.static('error'))

io.on('connection', function (socket) {
	console.log('new socket')
})

const PORT = 8081
server.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`)
})
