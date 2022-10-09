import express from 'express'
import { client } from '../utils/db'
import { checkPassword, hashPassword } from '../utils/hash'
import path from 'path'

export const userRoutes = express.Router()

//! /user
userRoutes.get('/', goLoginPage)
userRoutes.post('/login', login)
userRoutes.get('/logout', logout)
userRoutes.get('/login/google', loginGoogle)
userRoutes.get('/registerPage', registerPage)
userRoutes.post('/register', register)
userRoutes.get('/loginStatus', loginStatus)

async function goLoginPage(req: express.Request, res: express.Response) {
	// res.json(userResult.rows);
	const dir = path.join(__dirname, '../public/loginPage/login.html')
	res.sendFile(dir)
}

async function registerPage(req: express.Request, res: express.Response) {
	const dir = path.resolve('./public/register/register.html')
	console.log(dir)
	res.sendFile(dir)
}

class MyError {
	private message
	constructor(message: string) {
		this.message = message
	}
	getMessage(): string {
		return this.message
	}
}

class InternalError {
	private message
	constructor(message: string) {
		// super(message)
		this.message = message
	}

	getMessage(): string {
		return this.message
	}
}

async function register(req: express.Request, res: express.Response) {
	try {
		const username = req.body.username
		const password = req.body.password
		const checkPassword = req.body.checkPassword

		if (!username || !password) {
			throw new InternalError('Invalid username or password')
		}

		if (password !== checkPassword) {
			throw new InternalError('password check not matching')
		}

		let userResult = await client.query(
			`select * from users where username = $1`,
			[username]
		)
		let dbuser = userResult.rows[0]

		if (dbuser) {
			throw new MyError('Duplicate username')
		}

		//check duplicates
		//let xxx = await xxx
		//use dbeaver to check
		console.log(password)

		let hashedPassword = await hashPassword(password.toString())

		await client.query(
			`insert into users (username,password,is_admin) values ($1, $2, $3)`,
			[username, hashedPassword, false]
		)
		res.json({ message: 'User created' })
	} catch (error) {
		console.log(error)

		if (error instanceof InternalError) {
			console.log(error.getMessage())
			res.status(400).json({ message: 'InternalError' })
		}
		if (error instanceof MyError) {
			res.status(500).json({ message: error.getMessage() })
		}
	}
}

async function login(req: express.Request, res: express.Response) {
	console.log('userRoutes - [/login]')
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		res.status(400).json({
			message: 'Invalid username or password'
		})
		return
	}

	let userResult = await client.query(
		`select * from users where username = $1`,
		[username]
	)
	let dbuser = userResult.rows[0]
	console.log('dbuser =', dbuser)

	if (!dbuser) {
		res.status(400).json({
			message: 'Account is not found.'
		})
		return
	}

	//compare password
	let isMatched = await checkPassword(password, dbuser.password)
	if (!isMatched) {
		res.status(400).json({
			message: 'Invalid username or password'
		})
		return
	}

	req.session['isloggedin'] = true
	req.session['name'] = username
	req.session['userId'] = dbuser.id
	req.session['isAdmin'] = dbuser.is_admin
	req.session['createAt'] = dbuser.created_at
	console.log('Login successful')
	res.status(200).json({
		message: 'Success login'
	})
}

async function loginGoogle(req: express.Request, res: express.Response) {
	try {
		const accessToken = (req.session?.grant as any).response.access_token
		const fetchRes = await fetch(
			'https://www.googleapis.com/oauth2/v2/userinfo',
			{
				method: 'get',
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		)

		const result = await fetchRes.json()

		const users = (
			await client.query(
				`SELECT * FROM users WHERE users.username = $1`,
				[result.email]
			)
		).rows
		let user = users[0]
		if (!user) {
			//create a 32bit crypto password

			let password = await hashPassword(result.email)

			user = (
				await client.query(
					`INSERT INTO users (username,password,is_admin)
	            VALUES ($1,$2,$3) RETURNING *`,
					[result.email, password, false]
				)
			).rows[0]
		}
		if (req.session) {
			req.session['user'] = result
			req.session.name = result.name
			req.session.isloggedin = true
			req.session.userId = user.id
			req.session['isAdmin'] = user.is_admin
			req.session['createAt'] = user.created_at
		}
		return res.redirect('back')
	} catch (error) {
		res.status(401).send('Invalid credentials')
	}
}

// Option
const logoutPromise = (req: express.Request) =>
	new Promise((resolve, reject) => {
		req.session.destroy(() => {
			console.log(2)
			resolve(true)
		})
	})

async function logout(req: express.Request, res: express.Response) {
	try {
		// Option 1
		await logoutPromise(req)
		res.status(200).json({
			message: 'Success logout'
		})
		// // Option 2
		// req.session.destroy(() => {
		// 	res.status(200).json({
		// 		message: 'Success logout'
		// 	})
		// })
	} catch (error) {
		res.status(400).json({
			message: 'logout error'
		})
	}
}

async function loginStatus(req: express.Request, res: express.Response) {
	try {
		res.status(200).json(req.session)
	} catch (error) {
		res.status(400).json({
			message: 'get status error'
		})
	}
}
