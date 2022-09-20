window.onload = () => {
	init()
}
socket.on('cards-updated', (data) => {
	console.log(data)
	loadDataJson()
})

function init() {
	loadDataJson()
	loadLoginStatus()
	document
		.querySelector('.log-out-container')
		.addEventListener('click', logout)
	document
		.querySelector('.log-in-container')
		.addEventListener('click', loginPage)
	document
		.querySelector('.user-container')
		.addEventListener('click', userInfo)
}
async function loadLoginStatus() {
	const userRes = await fetch(`/user/loginStatus`)

	const userInfo = await userRes.json()
	// console.log(userInfo)
	if (userRes.ok) {
		if (userInfo.hasOwnProperty('userId')) {
			document.querySelector(
				'#greeting-text'
			).innerHTML = `Hi, ${userInfo.name}`
			// console.log(userInfo.name);
			document.querySelector('.log-in-container').style.display = 'none'
			document.querySelector('.log-out-container').style.display = 'flex'
			document.querySelector('.user-container').style.display = 'flex'

			console.log('you are logged in')
			if (userInfo.isAdmin) {
				document.querySelector('.admin-container').style.display =
					'flex'
				document.querySelector('.user-container').style.display = 'flex'
			} else if (userInfo.isAdmin == null || userInfo.isAdmin == false) {
				document.querySelector('.admin-container').style.display =
					'none'
			}
		} else {
			document.querySelector('#greeting-text').innerHTML = ''
			document.querySelector('#admin-container').style.display = 'none'
			document.querySelector('.log-in-container').style.display = 'flex'
			document.querySelector('.log-out-container').style.display = 'none'
			document.querySelector('.user-container').style.display = 'none'
		}
	}
}
async function loadDataJson() {
	const res = await fetch('/index')
	const data = await res.json()
	// console.log(eventData)
	console.log('loadDataJson')
	$('#list .wrapper').empty()
	$('#list').pagination({
		// you call the plugin
		// dataSource: hihiJson, // pass all the data
		dataSource: data,
		pageSize: 6, // put how many items per page you want
		callback: async function (data, pagination) {
			// data will be chunk of your data (json.Product) per page
			// that you need to display'
			document.querySelector('#list .wrapper').innerHTML = ''
			let indexHtml = ''
			for (let event of data) {
				const imageRes = await fetch(`/detail/event_id/${event.id}`)
				const loveRes = await fetch(
					`/detail/event_id/${event.id}/count`
				)
				const imageData = (await imageRes.json()).data
				const loveData = (await loveRes.json()).data
				// console.log(imageData)
				// console.log(loveData)
				indexHtml += `<div class="card col-sm-2 col-sm-3" style="width: 18rem;" data_index="${
					event.id
				}">
				<img src="../../../${imageData[0].filename}" class="card-img-top" alt="...">
				<div class="card-body">
					<h5 class="card-title">${event.title}</h5>
					<p class="card-text">${event.introduction} </p>
				
					<div class="icon-container">
					${
						event.is_sporty
							? `<div class="col-xl-2 icon-col">
					<div><i class="fa-solid fa-person-skiing
								select-icons"></i>
					</div>
					</div>`
							: ''
					}
					${
						event.is_luxury
							? `<div class="col-xl-2  icon-col">
				<div><i class="fa-solid fa-dollar-sign
							select-icons"></i></div>
				</div>`
							: ''
					}
					${
						event.is_relax
							? `
					<div class="col-xl-2 icon-col">
						<div><i class="fa-solid fa-spa select-icons"></i></div>
					</div>`
							: ''
					}
					${
						event.is_countryside
							? `<div class="col-xl-2 icon-col">
				<div><i class="fa-solid fa-mountain-sun
					select-icons"></i></div>
				</div>`
							: ''
					}
					</div>
				
					<a onclick="goDetailPage(${event.id})" id="go-${
					event.id
				}" class="btn btn-primary" data_index="${event.id}">GO!</a>
				</div>
				<div class="admin-corner" data_index="${
					event.id
				}"><i class="fa-solid fa-trash"></i><i class="fa-solid fa-pen-to-square"></i></div>
				${
					loveData == 0
						? `<div class="love-container" data_index="${event.id}">
					<i onclick="like(${event.id})" id="love-${event.id}" class="fa-solid fa-heart-circle-plus" data_index="${event.id}"></i>
				</div>`
						: `<div class="love-container" data_index="${event.id}" >
					<i onclick="like(${event.id})" id="love-${event.id}" class="fa-solid fa-heart heart-red-solid" data_index="${event.id}"></i>
				
				</div>`
				}
				</div>`
			}
			$('#list .wrapper').html(indexHtml)
		}
	})
}
async function like(eventIndex) {
	const resLogin = await fetch('/user/loginStatus')
	const userInfo = await resLogin.json()
	if (resLogin.ok) {
		if (!userInfo.hasOwnProperty('userId')) {
			const toastLiveExample = document.querySelector('.toast')
			const toast = new bootstrap.Toast(toastLiveExample)
			toast.show()
		} else {
			const res = await fetch('/detail/love', {
				method: 'POST',
				body: JSON.stringify({
					eventIndex: eventIndex
				}),
				headers: {
					'content-type': 'application/json; charset=utf-8'
				}
			})
			if (res.ok) {
				let abc = await res.json()
				console.log('you get interested in this event!')
				// console.log(abc)
				loadDataJson()
			}
		}
	}
}

function goDetailPage(eventIndex) {
	document.location.href = `/detail/detailPage/id/${eventIndex}`
}
function goDetailPage(eventIndex) {
	document.location.href = `/detail/detailPage/id/${eventIndex}`
}
async function loginPage() {
	window.location.href = '/user/login.html'
}

async function userInfo() {
	window.location.href = '/user/userInfo.html'
}

async function logout() {
	const res = await fetch(`/user/logout`)
	if (res.ok) {
		// document.querySelector("#greeting-text").innerHTML = "Logout successful";
		// setTimeout(() => {
		//   document.querySelector(".show-username").innerHTML = "";
		//   loadLoginStatus();
		// }, 1000);
		loadLoginStatus()
		loadIndexEvents()
	}
	loadIndexEvents()
}

async function loadRegion(region) {
	// let region = 'Africa'
	// let region = 'Americas'
	// let region = 'Asia'
	// let region = 'Europe'
	// let region = 'Oceania'
	let regionArray = []
	let result = []
	const dbRes = await fetch(`/index`)
	const dbJsons = await dbRes.json()
	const regionRes = await fetch(
		`https://restcountries.com/v3.1/region/${region}`
	)
	const regions = await regionRes.json()

	for (let region of regions) {
		regionArray.push(region.name.common)
	}

	for (let dbJson of dbJsons) {
		if (regionArray.includes(dbJson.country)) {
			result.push(dbJson)
		}
	}
	console.log(result)
	const data = result
	$('#list .wrapper').empty()
	$('#list').pagination({
		// you call the plugin
		// dataSource: hihiJson, // pass all the data
		dataSource: data,
		pageSize: 6, // put how many items per page you want
		callback: async function (data, pagination) {
			// data will be chunk of your data (json.Product) per page
			// that you need to display'
			document.querySelector('#list .wrapper').innerHTML = ''
			let indexHtml = ''
			for (let event of data) {
				const imageRes = await fetch(`/detail/event_id/${event.id}`)
				const loveRes = await fetch(
					`/detail/event_id/${event.id}/count`
				)
				const imageData = (await imageRes.json()).data
				const loveData = (await loveRes.json()).data
				// console.log(imageData)
				// console.log(loveData)
				indexHtml += `<div class="card col-sm-2 col-sm-3" style="width: 18rem;" data_index="${
					event.id
				}">
				<img src="../../../${imageData[0].filename}" class="card-img-top" alt="...">
				<div class="card-body">
					<h5 class="card-title">${event.title}</h5>
					<p class="card-text">${event.introduction} </p>
				
					<div class="icon-container">
					${
						event.is_sporty
							? `<div class="col-xl-2 icon-col">
					<div><i class="fa-solid fa-person-skiing
								select-icons"></i>
					</div>
					</div>`
							: ''
					}
					${
						event.is_luxury
							? `<div class="col-xl-2  icon-col">
				<div><i class="fa-solid fa-dollar-sign
							select-icons"></i></div>
				</div>`
							: ''
					}
					${
						event.is_relax
							? `
					<div class="col-xl-2 icon-col">
						<div><i class="fa-solid fa-spa select-icons"></i></div>
					</div>`
							: ''
					}
					${
						event.is_countryside
							? `<div class="col-xl-2 icon-col">
				<div><i class="fa-solid fa-mountain-sun
					select-icons"></i></div>
				</div>`
							: ''
					}
					</div>
				
					<a onclick="goDetailPage(${event.id})" id="go-${
					event.id
				}" class="btn btn-primary" data_index="${event.id}">GO!</a>
				</div>
				<div class="admin-corner" data_index="${
					event.id
				}"><i class="fa-solid fa-trash"></i><i class="fa-solid fa-pen-to-square"></i></div>
				${
					loveData == 0
						? `<div class="love-container" data_index="${event.id}">
					<i onclick="like(${event.id})" id="love-${event.id}" class="fa-solid fa-heart-circle-plus" data_index="${event.id}"></i>
				</div>`
						: `<div class="love-container" data_index="${event.id}" >
					<i onclick="like(${event.id})" id="love-${event.id}" class="fa-solid fa-heart heart-red-solid" data_index="${event.id}"></i>
				
				</div>`
				}
				</div>`
			}
			$('#list .wrapper').html(indexHtml)
		}
	})
}
