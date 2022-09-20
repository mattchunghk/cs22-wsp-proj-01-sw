import express from 'express'
import { io } from '../app'

import { client } from '../utils/db'

export const indexRoute = express.Router()

//below routes should be placed in detailRoutes in final stage
indexRoute.get('/', async (req, res) => {
	try {
		const eventResult = await client.query(
			'SELECT * from events ORDER BY created_at desc'
		)
		res.json(eventResult.rows)
		io.emit('cards-updated', { message: 'cards updated' })
		return
	} catch (err) {
		console.log(err)
	}
})
