// import { io } from '../app'
console.log('js running')
window.onload = () => {
	init()
}

function init() {
	loadEvents()
	loadMessages()
	getFunctionBar()

	document
		.querySelector('.log-out-container')
		.addEventListener('click', logout)
	document
		.querySelector('.log-in-container')
		.addEventListener('click', loginPage)
	document
		.querySelector('.logo-container')
		.addEventListener('click', goHomePage)
	document
		.querySelector('#messages-form')
		.addEventListener('submit', createMessages)
	document
		.querySelector('.delete-confirm')
		.addEventListener('click', deleteEvent)
	document
		.querySelector('.admin-container')
		.addEventListener('click', goAdminPage)
	document
		.querySelector('.userInfo-container')
		.addEventListener('click', goUserPage)

	// document.querySelector(".loadMore").addEventListener("submit", loadMore);
}
let loadMoreCount = 1

const socket = io.connect()
socket.on('new-message', (data) => {
	console.log(data)
	loadMessages()
})
socket.on('new-message-update', (data) => {
	console.log(data)
	loadMessages()
})
socket.on('message-delete', (data) => {
	console.log(data)
	loadMessages()
})

window.showMaxImg = (obj) => {
	var src = $(obj).attr('src')
	$('#imgModal')
		.find('#imgshow')
		.html(
			"<img src='" +
				src +
				"' class='carousel-inner img-responsive img-rounded' id=`pop-up-img` data-dismiss='modal'>"
		)
	$('#imgModal').modal('show')
	console.log(obj)
	console.log(src)
}

//? init function
async function getFunctionBar() {
	const pathnames = window.location.pathname.split('/')
	const pageId = pathnames[pathnames.length - 1]

	const res2 = await fetch(`/detail/event_id/${pageId}`) // Fetch from the correct url
	const event = (await res2.json()).data
	const res = await fetch(`/user/loginStatus`)
	const userInfo = await res.json()

	if (res.ok) {
		if (userInfo.hasOwnProperty('userId')) {
			document.querySelector('.messages-form-row').style.display = 'flex'
			document.querySelector(
				'#greeting-text'
			).innerHTML = `Hi, ${userInfo.name}`
			document.querySelector('#log-in-container').style.display = 'none'
			document.querySelector('#log-out-container').style.display = 'flex'
			document.querySelector('#userInfo-container').style.display = 'flex'

			if (event[0].user_id == userInfo.userId) {
				document.querySelector('.delete-container').style.display =
					'flex'
			} else {
				document.querySelector('.delete-container').style.display =
					'none'
			}
			if (userInfo.isAdmin) {
				document.querySelector('#admin-container').style.display =
					'flex'
				document.querySelector('.delete-container').style.display =
					'flex'
			} else if (userInfo.isAdmin == null || userInfo.isAdmin == false) {
				document.querySelector('#admin-container').style.display =
					'none'
			}
		} else {
			document.querySelector('#greeting-text').innerHTML = ''
			document.querySelector('#admin-container').style.display = 'none'
			document.querySelector('.delete-container').style.display = 'none'
			document.querySelector('.log-in-container').style.display = 'flex'
			document.querySelector('.log-out-container').style.display = 'none'
			document.querySelector('.messages-form-row').style.display = 'none'
			document.querySelector('#userInfo-container').style.display = 'none'
		}
	}
}
async function loadEvents() {
	console.log('loadEvents called')
	const pathnames = window.location.pathname.split('/')
	const pageId = pathnames[pathnames.length - 1]

	const eventsRes = await fetch(`/detail/event_id/${pageId}`)
	const event = (await eventsRes.json()).data

	// const totalLoveRes = await fetch(`/detail/totalLoveCount/${pageId}`)
	// const totalLoveResult = await totalLoveRes.json()

	// const eventLovedByRes = await fetch(`/detail/event_id/${pageId}/count`)
	// const eventLovedByUser = (await eventLovedByRes.json()).data

	if (eventsRes.ok) {
		let detailContainer = document.querySelector('#main-container')
		document.title = event[0].title
		detailContainer.innerHTML = `
        <div id="carouselExampleIndicators" class="carousel slide detail-slide" data-bs-ride="true">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        </div>
        <div class="carousel-inner detail-carousel">

        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

    <div class="row detail-content-row">
        <div class="col-lg-8 col-md-12 detail-content">
            <div class="row detail-detail">
                <h1 class="eventsTitle">${event[0].title}</h1>
                <div class="col-xxl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="detail-detail-content">
                        <div class="detail-detail-content-element" id="love-box">

                      

                        </div>
                    </div>
                </div>

                <div class="col-xxl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="Budget
                            detail-detail-content-element"><i class="fa-solid fa-sack-dollar"></i>
                        <span class="icon-text" id="icon-money">$US${
							event[0].budget
						}</span></div>
                </div>
                <div class="col-xxl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="detail-detail-content-element"> <i class="fa-solid fa-users"></i>
                        <span class="icon-text" id="icon-raking"></span>
                    </div>
                </div>
                <div class="col-xxl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="detail-detail-content-element"> <i class="fa-solid fa-location-dot"></i>
                        <span class="icon-text" id="icon-country">${
							event[0].country
						}</span>
                    </div>
                </div>
                <div class="col-xxl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="detail-detail-content-element"> <i class="fa-solid
                                fa-plane-departure"></i>
                        <span class="icon-text" id="icon-depart">${new Date(
							event[0].start_date
						).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="col-xxl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="detail-detail-content-element"> <i class="fa-solid
                                fa-plane-arrival"></i>
                        <span class="icon-text" id="icon-arrival">${new Date(
							event[0].end_date
						).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div class="detail-introduction">
            ${event[0].introduction}</div>
            <div class="row icon-row">
            ${
				event[0].is_sporty
					? `<div class="col-xl-3 col-md-6 col-6 icon-col">
            <div><i class="fa-solid fa-person-skiing
                        select-icons"></i>Sporty
            </div>
        </div>`
					: ''
			}

        ${
			event[0].is_luxury
				? `<div class="col-xl-3 col-md-6 col-6 icon-col">
        <div><i class="fa-solid fa-dollar-sign
                    select-icons"></i>Luxury</div>
    </div>`
				: ''
		}

    ${
		event[0].is_relax
			? `             
    <div class="col-xl-3 col-md-6 col-6 icon-col">
        <div><i class="fa-solid fa-spa select-icons"></i>Relax</div>
    </div>`
			: ''
	}

${
	event[0].is_countryside
		? `<div class="col-xl-3 col-md-6 col-6 icon-col">
<div><i class="fa-solid fa-mountain-sun
            select-icons"></i>Country Side</div>
</div>`
		: ''
}

<div class="event-participants">
<div class="participants-title">Joined Participants</div>
<div class="participants-content"></div>
</div>
            </div>
        </div>




        <div class="col-lg-4 col-md-12 map">
            <iframe width="100%" height="400" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDgzJsIne7hMjjk8yGSPloiQ_FYdNr-g-g&q=${event[0].city
				.trim()
				.split(' ')
				.join('+')},${event[0].country
			.trim()
			.split(' ')
			.join('+')}&zoom=10"></iframe>
            <div class="d-grid gap-2 ">
                <button class="btn btn-primary btn-submit" id="join-btn">Join</button>
            </div>
        </div>
    </div>
    


    
    
    `

		let imgInner = document.querySelector('.carousel-inner')
		let imgDot = document.querySelector('.carousel-indicators')
		imgInner.innerHTML = ''
		for (let i = 0; i < event.length; i++) {
			if (event[i].filename == null) {
				imgInner.innerHTML += ''
			} else {
				if (i == 0) {
					imgInner.innerHTML += ` <div class="carousel-item active">
                <img src="../../../${event[i].filename}" class="d-block w-100" id="detail-photo-main" alt="...">
              </div>`
				} else {
					imgDot.innerHTML += `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" aria-label="Slide ${i}"></button>`
					imgInner.innerHTML += `<div class="carousel-item">
                <img src="../../../${event[i].filename}" class="d-block w-100"id="detail-photo" alt="">
              </div>`
				}
			}
		}
		let joinBtnDiv = document.querySelector('#join-btn')

		joinCount()
		loadHeat()
		loadEventParticipants()

		joinBtnDiv.addEventListener('click', async function (event) {
			const res = await fetch(`/detail/join/?eventId=${pageId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (res.ok) {
				joinCount()
			}
		})
	}
}

async function loadMessages() {
	const pathnames = window.location.pathname.split('/')
	const pageId = pathnames[pathnames.length - 1]
	const messagesResult = await fetch(`/messages/get/${pageId}`)
	const messagesJson = await messagesResult.json()

	const messagesContainer = document.querySelector('#messages_container')
	messagesContainer.innerHTML = ''

	if (messagesJson.length == 0) {
		document.querySelector('#messages_container').style.backgroundColor =
			'#FFFFFF'
	}

	for (let message of messagesJson) {
		let imageHtml = ''

		const loginStatusRes = await fetch(`/user/loginStatus`)
		const loginStatusJson = await loginStatusRes.json()

		document.querySelector('#messages_container').style.backgroundColor =
			'#FA4A60'

		if (message.images != '') {
			for (let messagesImage of message.images) {
				// console.log(messagesImage);

				imageHtml += `
            <div  class="carousel-item active msg-item-div">
                    <img onclick="showMaxImg(this)" src="../../../${messagesImage}" class=" d-block w-100 msg-img" alt="..."> 
            </div>`
			}

			messagesContainer.innerHTML += `
           <div class="messageAllDivs" >

                <div class="row msg-row">
                <div class="row heading-setting">
                
                <div for="exampleFormControlTextarea1" class="form-label col-md-4 col-12 msg-header" >${
					message.heading
				}</div>
                
                <div class="col-md-4 col-6"> User: <span> ${
					message.username
				}</span></div>
                
                <div class="col-md-4 col-6"> Create at: <span> ${new Date(
					message.created_at
				).toLocaleDateString()}</span></div>
            
         
                </div>
                    
                <div class="col-md-4 images-setting">
                <div id="carouselExampleControls${
					message.id
				}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner msg-carousel-inner ">
                  ${imageHtml}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls${
					message.id
				}" data-bs-slide="prev">
                  <span class="" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls${
					message.id
				}" data-bs-slide="next">
                  <span class="" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
             </div>




                    <div class="col-md-8 box1">
                        <textarea class="form-control message-input readtext" id="exampleFormControlTextarea1" placeholder=""
                            cols="110" rows="10"  ${
								loginStatusJson.isAdmin ||
								loginStatusJson.userId == message.user_id
									? ''
									: 'disabled'
							} >${message.comment}</textarea>
                        <div class="row button-div">
                        
                            <div class="col-md-4 col-4">
                            

                                <button class='msg-btn delete-btn ' index="${
									message.id
								}" ${
				loginStatusJson.isAdmin ||
				loginStatusJson.userId == message.user_id
					? ''
					: 'style= "display:none"'
			}>

                                    <i class="bi bi-trash3-fill" index="${
										message.id
									}"></i>
                                </button>




                            </div>

                            <div class="col-md-4 col-4 edit-btn-div">
                                <button class='msg-btn edit-btn' index="${
									message.id
								}"  ${
				loginStatusJson.isAdmin ||
				loginStatusJson.userId == message.user_id
					? ''
					: 'style= "display:none"'
			}>
                                    <i class="bi bi-pencil-square" index="${
										message.id
									}"></i>
                                </button>
                            </div>
  
                            <div class="col-md-4 col-4 like-btn-div">
                   
                                <button class='msg-btn like-btn' index="${
									message.id
								}" >
                                    <i class="bi bi-emoji-heart-eyes" index="${
										message.id
									}"></i>
                                    <span class="likeview" id="like_value" index="${
										message.id
									}">${
				message.favorite_count == null ? 0 : message.favorite_count
			}</span>
                                </button>

                           
                                </div>
                        </div>

                    </div>
        

                 </div>`
		} else {
			messagesContainer.innerHTML += `
      <div class="messageAllDivs" >

              <div class="row msg-row">
              <div class="row heading-setting">
              
              <div for="exampleFormControlTextarea1" class="form-label col-md-4 col-12 msg-header" >${
					message.heading
				}</div>
              
              <div class="col-md-4 col-6"> User: <span> ${
					message.username
				}</span></div>
              
              <div class="col-md-4 col-6"> Create at: <span> ${new Date(
					message.created_at
				).toLocaleDateString()}</span></div>
          
       
              </div>



                  <div class="col-md-12 box1">
                      <textarea class="form-control message-input readtext" id="exampleFormControlTextarea1" placeholder=""
                          cols="110" rows="10" ${
								loginStatusJson.isAdmin ||
								loginStatusJson.userId == message.user_id
									? ''
									: 'disabled'
							} >${message.comment}</textarea>
                      <div class="row button-div">
                      
                          <div class="col-md-4 col-4">
                          

                              <button class='msg-btn delete-btn ' index="${
									message.id
								}" ${
				loginStatusJson.isAdmin ||
				loginStatusJson.userId == message.user_id
					? ''
					: 'style= "display:none"'
			}>

                                  <i class="bi bi-trash3-fill" index="${
										message.id
									}"></i>
                              </button>




                          </div>

                          <div class="col-md-4 col-4 edit-btn-div">
                              <button class='msg-btn edit-btn' index="${
									message.id
								}"  ${
				loginStatusJson.isAdmin ||
				loginStatusJson.userId == message.user_id
					? ''
					: 'style= "display:none"'
			}>
                                  <i class="bi bi-pencil-square" index="${
										message.id
									}"></i>
                              </button>
                          </div>

                          <div class="col-md-4 col-4 like-btn-div">
                 
                              <button class='msg-btn like-btn' index="${
									message.id
								}" >
                                  <i class="bi bi-emoji-heart-eyes" index="${
										message.id
									}"></i>
                                  <span class="likeview" id="like_value" index="${
										message.id
									}">${
				message.favorite_count == null ? 0 : message.favorite_count
			}</span>
                              </button>

                         
                              </div>
                      </div>

                  </div>
      

               </div>`
		}
	}

	const messagesAllDivs = document.querySelectorAll('.messageAllDivs')
	for (let messagesDivs of messagesAllDivs) {
		const editBtn = await messagesDivs.querySelector('.edit-btn')
		const deleteBtn = await messagesDivs.querySelector('.delete-btn')
		// const angryBtn = await messagesDivs.querySelector('.angry-btn')
		const likeBtn = await messagesDivs.querySelector('.like-btn')
		// console.log(deleteBtn);

		// Call Edit
		editBtn.addEventListener('click', async (event) => {
			const messageEdit =
				messagesDivs.querySelector('.message-input').value
			// console.log(messagesDivs.querySelector('.message-input').disabled);
			// messagesDivs.querySelector('.message-input').classList.toggle('readonly');

			console.log(messageEdit)
			const editIndex = event.currentTarget.getAttribute('index')
			// console.log(editIndex);
			// Call Edit API
			const messageEditRes = await fetch('/messages/update', {
				method: 'PUT',
				body: JSON.stringify({
					messages_comment: messageEdit,
					index: editIndex
				}), //??????JSON?????????headers
				headers: { 'Content-Type': 'application/json' }
			})
			// if (messageEditRes.ok) {
			// 	loadMessages()
			// }
		})

		//Call Delete
		deleteBtn.addEventListener('click', async (event) => {
			const editIndex = event.currentTarget.getAttribute('index')
			// console.log(editIndex);
			// Call Delete API
			const messageEditRes = await fetch('/messages/delete', {
				method: 'DELETE',
				body: JSON.stringify({
					index: editIndex
				}), //??????JSON?????????headers
				headers: { 'Content-Type': 'application/json' }
			})
			// if (messageEditRes.ok) {
			// 	loadMessages()
			// }
		})

		// let likePattern = true;
		likeBtn.addEventListener('click', async (event) => {
			const editIndex = event.currentTarget.getAttribute('index')
			console.log(event.currentTarget)

			const messageEditRes = await fetch('/messages/like', {
				method: 'POST',
				body: JSON.stringify({
					index: editIndex
				}), //??????JSON?????????headers
				headers: { 'Content-Type': 'application/json' }
			})
			if (messageEditRes.ok) {
				loadMessages()
			} else {
				likeBtn.innerHTML = 'Please Login first'
				setTimeout(() => {
					loadMessages()
				}, 1000)
			}
		})
	}
}

async function loadEventParticipants() {
	const pathnames = window.location.pathname.split('/')
	const pageId = pathnames[pathnames.length - 1]
	const res = await fetch(`/detail/eventsParticipants/${pageId}`)
	const eventParticipants = await res.json()
	let participantsContent = document.querySelector('.participants-content')

	if (res.ok) {
		participantsContent.innerHTML = ''
		for (let i = 0; i < eventParticipants.length; i++) {
			if (i == eventParticipants.length - 1) {
				participantsContent.innerHTML += `${eventParticipants[i].username}`
			} else {
				participantsContent.innerHTML += `${eventParticipants[i].username}, `
			}
		}
	}
}

//? addEventListener function
async function goAdminPage() {
	window.location.href = '/adminPage.html'
}
async function goUserPage() {
	window.location.href = '/user/userinfo.html'
}
async function goHomePage() {
	window.location.href = '/'
}
async function deleteEvent() {
	const pathnames = window.location.pathname.split('/')
	const pageId = pathnames[pathnames.length - 1]
	const res = await fetch(`/detail/delete/${pageId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if (res.ok) {
		goHomePage()
	} else {
		console.log('Error deleting')
	}
}
async function detailLove() {
	const pathnames = window.location.pathname.split('/')
	const pageId = pathnames[pathnames.length - 1]
	const res = await fetch(`/detail/love`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ eventIndex: pageId })
	})
	let heatBox = document.querySelector('#love-box')
	if (res.ok) {
		// loadEvents();
		loadHeat()
	} else {
		heatBox.innerHTML = '<i class="fa-solid fa-lock"></i>'
		heatBox.innerHTML += 'Please Login first'
		setTimeout(() => {
			loadHeat()
		}, 1000)
	}
}

async function logout() {
	const res = await fetch(`/user/logout`)
	if (res.ok) {
		document.querySelector('#greeting-text').innerHTML = 'Logout successful'
		setTimeout(() => {
			document.querySelector('#greeting-text').innerHTML = ''
		}, 2000)
		loadMessages()
		getFunctionBar()
		joinCount()
	}
}

async function createMessages(event) {
	event.preventDefault()
	const pathnames = window.location.pathname.split('/')
	const pageId = pathnames[pathnames.length - 1]
	const messageData = new FormData(event.currentTarget)
	console.log(event.currentTarget)
	console.log(messageData)

	const res = await fetch(`/messages/create/${pageId}`, {
		method: 'POST',
		body: messageData
	})
	const result = await res.text()
	if (res.status === 200) {
		event.target.reset()
		console.log(result)
	}
}
async function joinCount() {
	const pathnames = window.location.pathname.split('/')
	const pageId = pathnames[pathnames.length - 1]
	const res = await fetch(`/detail/joinCount/?eventId=${pageId}`)
	const joinCount = await res.json()

	const res2 = await fetch(`/detail/event_id/${pageId}`) // Fetch from the correct url
	const event = (await res2.json()).data

	let joinBtnDiv = document.querySelector('#join-btn')
	let joinedPplSpan = document.querySelector('#icon-raking')

	if (res.ok) {
		joinedPplSpan.innerHTML = `${joinCount[1].count}/${event[0].people_quota}`
		if (joinCount[0] == false) {
			joinBtnDiv.innerHTML = 'Please Login first'
			joinBtnDiv.disabled = true
		} else {
			if (joinCount[0].count == 1) {
				if (joinCount[0].count == 1) {
					joinBtnDiv.innerHTML = 'leave'
				} else {
					joinBtnDiv.innerHTML = 'Join'
				}
			} else {
				if (joinCount[1].count >= event[0].people_quota) {
					joinBtnDiv.innerHTML = 'Full'
					joinBtnDiv.disabled = true
				} else {
					joinBtnDiv.innerHTML = 'Join'
				}
			}
		}
		loadEventParticipants()
	}
}

//? general function
async function loginPage() {
	window.location.href = '/loginPage/login.html'
}
async function loadHeat() {
	const pathnames = window.location.pathname.split('/')
	const pageId = pathnames[pathnames.length - 1]

	const eventLovedByRes = await fetch(`/detail/event_id/${pageId}/count`)
	const eventLovedByUser = (await eventLovedByRes.json()).data

	const totalLoveRes = await fetch(`/detail/totalLoveCount/${pageId}`)
	const totalLoveResult = await totalLoveRes.json()

	let heatBox = document.querySelector('#love-box')

	if (eventLovedByRes.ok) {
		if (eventLovedByUser == 1) {
			heatBox.innerHTML = '<i class="fa-solid fa-heart"></i>'
		} else {
			heatBox.innerHTML = '<i class="fa-regular fa-heart"></i>'
		}
		heatBox.innerHTML += `<spain class="detail-like-text">${totalLoveResult.count} interested</spain>`

		document
			.querySelector('#love-box')
			.addEventListener('click', detailLove)
	}
}

window.showMaxImg = (obj) => {
	var src = $(obj).attr('src')
	$('#imgModal')
		.find('#imgshow')
		.html(
			"<img src='" +
				src +
				"' class='carousel-inner img-responsive img-rounded' id=`pop-up-img` data-dismiss='modal'>"
		)
	$('#imgModal').modal('show')
	console.log(obj)
	console.log(src)
}
