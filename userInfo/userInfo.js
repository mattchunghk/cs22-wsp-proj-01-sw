console.log('js running')
window.onload = () => {
	init()
}

function init() {
	loadCreateEvents()
	getFunctionBar()

	document
		.querySelector('.logo-container')
		.addEventListener('click', goHomePage)
	document
		.querySelector('#home-container')
		.addEventListener('click', goHomePage)
	document
		.querySelector('.log-out-container')
		.addEventListener('click', logout)
	document
		.querySelector('.log-in-container')
		.addEventListener('click', loginPage)
	document
		.querySelector('.eventCreated-btn')
		.addEventListener('click', loadCreateEvents)
	document
		.querySelector('.eventJoined-btn')
		.addEventListener('click', loadJoinedEvents)
	document
		.querySelector('.eventLoved-btn')
		.addEventListener('click', loadLovedEvents)
	document
		.querySelector('.admin-container')
		.addEventListener('click', goAdminPage)
}

async function getFunctionBar() {
	const res = await fetch(`/user/loginStatus`)
	const userInfo = await res.json()

	if (res.ok) {
		if (userInfo.hasOwnProperty('userId')) {
			document.querySelector(
				'#greeting-text'
			).innerHTML = `Hi, ${userInfo.name}`
			document.querySelector('#log-in-container').style.display = 'none'
			document.querySelector('#log-out-container').style.display = 'flex'
			document.querySelector(
				'.show-username'
			).innerHTML = `${userInfo.name}`
			document.querySelector(
				'.joined-date'
			).innerHTML = `${userInfo.createAt}`

			if (userInfo.isAdmin) {
				document.querySelector('#admin-container').style.display =
					'flex'
			} else if (userInfo.isAdmin == null || userInfo.isAdmin == false) {
				document.querySelector('#admin-container').style.display =
					'none'
			}
		} else {
			document.querySelector('#greeting-text').innerHTML = ''
			document.querySelector('#admin-container').style.display = 'none'
			document.querySelector('.log-in-container').style.display = 'flex'
			document.querySelector('.log-out-container').style.display = 'none'
		}
	}
}

async function loadCreateEvents() {
	// const event=req.params.table;
	const res = await fetch('/detail/userPage/created')
	const resUser = await res.json()

	if (res.ok) {
		const eventContainer = document.querySelector('.event-container')
		eventContainer.innerHTML = ''
		console.log(resUser)

		for (let event of resUser) {
			eventContainer.innerHTML += `
			
<div class="event-display">
    <div class="row">
	    <div class="col-md-4 col-12">
            <img class="event-photo-conatiner" src="../../../${
				event.filename
			}"></img> 
		</div> 
		<div class="col-md-8 col-12 event-content-col">
            <div class="event-content">
              <h4 class="event-title"><span id="event-title-p">${
					event.title
				}</span></h4> 
              <div class="event-country"><span id="event-title-country">${
					event.country
				} -  ${event.city}</span></div>
              <div class="event-date">Trip Date: <span id="event-title-date">${new Date(
					event.start_date
				).toLocaleDateString()} - ${new Date(
				event.end_date
			).toLocaleDateString()}</span></div>
			  <input type="button" class="go-btn" onclick="location.href='/detail/detailPage/id/${
					event.id
				}';" value="Go" />
            </div>
		</div>
	</div> 		
</div>
`
		}
	}
}

async function loadJoinedEvents() {
	// const event=req.params.table;
	const res = await fetch('/detail/userPage/joined')
	const resUser = await res.json()

	if (res.ok) {
		const eventContainer = document.querySelector('.event-container')
		eventContainer.innerHTML = ''
		console.log(resUser)

		for (let event of resUser) {
			eventContainer.innerHTML += `
			<div class="event-display">
			<div class="row">
				<div class="col-md-4 col-12 event-content-col">
					<img class="event-photo-conatiner" src="../../../${event.filename}"></img> 
				</div> 
				<div class="col-md-8 col-12">
					<div class="event-content">
					  <h4 class="event-title">title <span id="event-title-p">${
							event.title
						}</span></h4> 
					  <div class="event-country">Iceland <span id="event-title-country">${
							event.country
						} ${event.city}</span></div>
					  <div class="event-date">go to Iceland <span id="event-title-date">${new Date(
							event.start_date
						).toLocaleDateString()}</span></div>
					  <input type="button" class="go-btn" onclick="location.href='/detail/detailPage/id/${
							event.id
						}';" value="Go" />
					</div>
				</div>
			</div> 		
		</div>
`
		}
	}
}
async function loadLovedEvents() {
	// const event=req.params.table;
	const res = await fetch('/detail/userPage/loved')
	const resUser = await res.json()

	if (res.ok) {
		const eventContainer = document.querySelector('.event-container')
		eventContainer.innerHTML = ''
		console.log(resUser)

		for (let event of resUser) {
			eventContainer.innerHTML += `
			<div class="event-display">
			<div class="row">
				<div class="col-md-4 col-12">
					<img class="event-photo-conatiner" src="../../../${event.filename}"></img> 
				</div> 
				<div class="col-md-8 col-12 event-content-col">
					<div class="event-content">
					  <h4 class="event-title">title <span id="event-title-p">${
							event.title
						}</span></h4> 
					  <div class="event-country">Iceland <span id="event-title-country">${
							event.country
						} ${event.city}</span></div>
					  <div class="event-date">go to Iceland <span id="event-title-date">${new Date(
							event.start_date
						).toLocaleDateString()}</span></div>
					  <input type="button" class="go-btn" onclick="location.href='/detail/detailPage/id/${
							event.id
						}';" value="Go" />
					</div>
				</div>
			</div> 		
		</div>
		  `
		}
	}
}

async function goHomePage() {
	window.location.href = '/'
}

async function logout() {
	const res = await fetch(`/user/logout`)
	if (res.ok) {
		document.querySelector('#greeting-text').innerHTML = 'Logout successful'
		setTimeout(() => {
			document.querySelector('#greeting-text').innerHTML = ''
			window.location.href = '/'
		}, 2000)
	}
}

async function loginPage() {
	window.location.href = '/user/login.html'
}

async function goAdminPage() {
	window.location.href = '/adminPage.html'
}
