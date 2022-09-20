import express, { Request, Response } from 'express'
import { client } from '../utils/db'
import { checkPassword, hashPassword } from '../utils/hash'
import fetch from 'cross-fetch'
import crypto from 'crypto'
import { logger } from '../utils/logger'
import { formParse } from '../utils/upload'
import { isLoggedIn } from '../utils/isLoggedIn'
import { io } from '../app'

//! "/submit"
export const eventsSubmitRoute = express.Router()

eventsSubmitRoute.get('/', submitGet)
eventsSubmitRoute.post('/formidable', isLoggedIn, getSubmitData)

function submitGet(req: Request, res: Response) {
	try {
		res.redirect('/submit/eventsForm.html')
	} catch (error) {
		res.status(404).send(error)
	}
}

async function getSubmitData(req: Request, res: Response) {
	try {
		console.log('post- formidable')

		const {
			filename1: images1,
			filename2: images2,
			filename3: images3,

			title: title,
			startDate: startDate,
			endDate: endDate,
			country: country,
			place: place,
			ppl: ppl,
			budget: budget,
			intro: intro,
			sporty: sporty,
			luxury: luxury,
			relaxed: relaxed,
			countrySide: countrySide
			// fromSocketId
		} = await formParse(req)

		let startDateISO = new Date(startDate).toISOString()
		let endDateISO = new Date(endDate).toISOString()

		if (startDateISO > endDateISO) {
			res.status(400).json({
				message: 'DATE check failed'
			})
			return
		}

		let eventId = await client.query(
			'INSERT INTO events (user_id,title,country,city,introduction,budget,start_date,end_date,people_quota,is_sporty,is_luxury,is_relax,is_countryside) VALUES  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING ID',
			[
				req.session.userId,
				title,
				country,
				place,
				intro,
				budget,
				startDate,
				endDate,
				ppl,
				sporty,
				luxury,
				relaxed,
				countrySide
			]
		)

		console.log(eventId.rows[0].id)

		await client.query(
			'INSERT INTO event_images (filename,event_id) VALUES ($1,$2)',
			[images1, eventId.rows[0].id]
		)
		await client.query(
			'INSERT INTO event_images (filename,event_id) VALUES ($1,$2)',
			[images2, eventId.rows[0].id]
		)
		await client.query(
			'INSERT INTO event_images (filename,event_id) VALUES ($1,$2)',
			[images3, eventId.rows[0].id]
		)
		await client.query(
			'insert into event_participants (user_id, event_id) values ($1,$2)',
			[req.session.userId, eventId.rows[0].id]
		)

		res.json({
			message: 'Upload successful'
		})
		io.emit('cards-updated', { message: 'cards updated' })
	} catch (error) {
		res.status(404).send(error)
	}
}
