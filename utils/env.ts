import dotenv from 'dotenv'

dotenv.config()

export let env = {
	DB_NAME: process.env.DB_NAME,
	DB_USERNAME: process.env.DB_USERNAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	SESSION_SECRET: process.env.SESSION_SECRET || 'default secret',
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
}
