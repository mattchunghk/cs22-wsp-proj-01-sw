import express, { Request, Response } from 'express'
import { client } from '../utils/db'
import { checkPassword, hashPassword } from '../utils/hash'
import fetch from 'cross-fetch'
import crypto from 'crypto'
import { logger } from '../utils/logger'
import { formParse } from '../utils/upload'
import path, { resolve } from 'path'
import { isLoggedIn } from '../utils/isLoggedIn'
import { request } from 'http'
import fs from 'fs'
import { io } from '../app'

export const detailPageRoute = express.Router()

//? /detail
detailPageRoute.get('/event_id/:id', getDetail)
detailPageRoute.get('/detailPage/id/:id', goDetailPage)
detailPageRoute.post('/join', isLoggedIn, joinEvent)
detailPageRoute.get('/joinCount', joinCount)

detailPageRoute.get('/userPage/joined', isLoggedIn, userPageJoin)
detailPageRoute.get('/userPage/loved', isLoggedIn, userPageLove)
detailPageRoute.get('/userPage/created', isLoggedIn, userPageCreate)

detailPageRoute.get('/eventsParticipants/:id', eventsParticipants)
detailPageRoute.get('/totalLoveCount/:id', totalLoveCount)
detailPageRoute.delete('/delete/:id', isLoggedIn, deleteEvents)
// Query
//localhost:8080/detail/detailPage.html?id=2

// Params
//localhost:8080/detail/detailPage/2

// Params
async function goDetailPage(req: Request, res: Response) {
	const dir = path.resolve('./detailPage/detailPage.html')
	res.sendFile(dir)
}

async function getDetail(req: Request, res: Response) {
	const id = req.params.id
	console.log('event_id= ', id)
	try {
		const events = await client.query(
			`select * from event_images INNER JOIN events ON event_images.event_id = events.id where events.id = ${id};`
		)
		// console.log("events= ", events.rows);
		res.status(200).json({ data: events.rows })
		// res.status(200).json(events.rows);
	} catch (error) {
		res.status(404).send(error)
	}
}

async function joinEvent(req: Request, res: Response) {
	const eventId: any = req.query.eventId
	try {
		const eventCounts = await client.query(
			// `SELECT count(*) FROM event_participants WHERE event_id=${eventId} and user_id = ${req.session.useId};`
			`SELECT count(*) FROM event_participants WHERE event_id=${eventId} and user_id = ${req.session.userId};`
		)

		if (parseInt(eventCounts.rows[0].count) == 0) {
			await client.query(
				`INSERT INTO event_participants (user_id, event_id) VALUES ($1,$2)`,
				[req.session.userId, eventId]
			)
		} else {
			await client.query(
				`DELETE FROM event_participants WHERE event_id=${eventId} and user_id = ${req.session.userId};`
			)
		}
		res.status(200).json(eventCounts.rows[0])
	} catch (error) {
		res.status(404).send(error)
	}
}

async function joinCount(req: Request, res: Response) {
	const eventId: any = req.query.eventId

	try {
		if (req.session.userId != undefined) {
			const userJoined = await client.query(
				`SELECT count(*) FROM event_participants WHERE event_id=${eventId} and user_id = ${req.session.userId};`
			)
			const eventJoinCounts = await client.query(
				`SELECT count(*) FROM event_participants WHERE event_id=${eventId};`
			)
			res.status(200).json([userJoined.rows[0], eventJoinCounts.rows[0]])
		} else {
			const eventJoinCounts = await client.query(
				`SELECT count(*) FROM event_participants WHERE event_id=${eventId};`
			)
			res.status(200).json([false, eventJoinCounts.rows[0]])
		}
	} catch (error) {
		res.status(404).send(error)
	}
}

async function deleteEvents(req: Request, res: Response) {
	const id = req.params.id
	console.log(`deleting ${id}`)
	try {
		// 	let msgImgs: any = await client.query(`
		// select filename from message_images where message_id in (select id from messages where event_id = ${id});
		// `)
		// 	for (let msgImg of msgImgs.rows) {
		// 		fs.unlinkSync(
		// 			`/Users/mattchung/Desktop/c22/WSP/cs22-wsp-proj-01-sw/uploads/${msgImg.filename}`
		// 		)
		// 	}

		// 	let eventImgs: any = await client.query(`
		// select filename from event_images where event_id = ${id}
		// `)
		// 	for (let eventImg of eventImgs.rows) {
		// 		fs.unlinkSync(
		// 			`/Users/mattchung/Desktop/c22/WSP/cs22-wsp-proj-01-sw/uploads/${eventImg.filename}`
		// 		)
		// 	}

		await client.query(`
    DELETE FROM user_favorite_messages WHERE message_id in (select id from messages WHERE event_id = ${id});
    DELETE FROM message_images WHERE message_id in (select id from messages WHERE event_id = ${id});
    DELETE FROM messages WHERE event_id = ${id};
    DELETE FROM event_images WHERE event_id = ${id};
    DELETE FROM event_participants WHERE event_id = ${id};
    DELETE FROM favorite_events WHERE event_id = ${id};
    DELETE FROM events WHERE id = ${id};
    `)
		res.status(200).json({ message: 'Delete Events successfully' })
		io.emit('cards-updated', { message: 'cards updated' })
	} catch (error) {
		res.status(404).send(error)
	}
}

async function totalLoveCount(req: Request, res: Response) {
	const id = req.params.id
	try {
		let totalLoveResult = await client.query(`
    SELECT count(*) FROM favorite_events WHERE event_id = ${id};
    `)
		res.status(200).json(totalLoveResult.rows[0])
	} catch (error) {
		res.status(404).send(error)
	}
}

async function userPageJoin(req: Request, res: Response) {
	const userId = req.session.userId
	try {
		let userInfoResult = await client.query(`
    with images as (
      select * from event_images where id in (
      select MIN(id) from event_images group by event_id
      ))
      select event_participants.id, events.*, users.id as user_id, images.filename as filename from events 
      left join images on images.event_id = events.id
      inner join event_participants on event_participants.event_id = events.id 
      inner join users on users.id = event_participants.user_id
      where users.id  = ${userId};
    `)
		res.status(200).json(userInfoResult.rows)
	} catch (error) {
		res.status(404).send(error)
	}
}

async function userPageLove(req: Request, res: Response) {
	const userId = req.session.userId
	try {
		let userInfoResult = await client.query(`
    with images as (
      select * from event_images where id in (
      select MIN(id) from event_images group by event_id
      ))
      select favorite_events.id, events.*, users.id as user_id, images.filename as filename from events 
      left join images on images.event_id = events.id
      inner join favorite_events on favorite_events.event_id = events.id 
      inner join users on users.id = favorite_events.user_id
      where users.id  = ${userId};
    `)
		res.status(200).json(userInfoResult.rows)
	} catch (error) {
		res.status(404).send(error)
	}
}

async function userPageCreate(req: Request, res: Response) {
	const userId = req.session.userId
	try {
		let userInfoResult = await client.query(`
    with images as (
      select * from event_images where id in (
      select MIN(id) from event_images group by event_id
      ))
      select events.*, users.id as user_id, images.filename as filename from events 
      left join images on images.event_id = events.id
      inner join users on users.id = events.user_id
      where users.id  = ${userId};
    `)
		res.status(200).json(userInfoResult.rows)
	} catch (error) {
		res.status(404).send(error)
	}
}

async function eventsParticipants(req: Request, res: Response) {
	const eventsId = req.params.id
	try {
		let userInfoResult = await client.query(`
    select username from users where id in (select user_id from event_participants where event_id = ${eventsId});
    `)
		res.status(200).json(userInfoResult.rows)
	} catch (error) {
		res.status(404).send(error)
	}
}

detailPageRoute.post('/love', isLoggedIn, async (req, res) => {
	const userID = req.session['userId'] || ''
	const eventID = req.body.eventIndex
	console.log('EventIndex= ' + eventID)
	try {
		let userLIkeStatus = await client.query(
			`Select * FROM favorite_events
      where user_id =($1) and event_id=($2)`,
			[userID, eventID]
		)
		console.log(userLIkeStatus)
		if (userLIkeStatus.rowCount > 0) {
			await client.query(
				/*sql*/ `DELETE FROM favorite_events
    where user_id =($1) and event_id=($2)`,
				[userID, eventID]
			)
		} else {
			await client.query(
				`INSERT INTO favorite_events (user_id, event_id) VALUES ($1,$2)`,
				[userID, eventID]
			)
		}
		res.status(200).json({ message: 'Success' })
		return
	} catch (err: any) {
		logger.error(err)
		res.status(400).send(err.message)
		return
	}
})

detailPageRoute.get('/event_id/:eventId/count', async (req, res) => {
	const userId = req.session?.userId || '1'
	const eventId = req.params.eventId
	console.log({ userId })
	console.log({ eventId })

	try {
		let eventLovedbyUser = await client.query(
			`SELECT count(*) FROM favorite_events WHERE event_id=${eventId} and user_id=${userId};`
		)
		const count = eventLovedbyUser.rows[0].count
		// await client.query(
		//   /*sql*/ `Update favorite_events set count=($1) WHERE id=($2)`,
		//   [eventLikeStatus.rowCount, eventID]
		// );
		console.log(eventLovedbyUser)

		res.status(200).json({
			data: count
		})
		return
	} catch (err: any) {
		res.status(400).send(err.message)
	}
})
