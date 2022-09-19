window.onload = () => {
	init()
}

function init() {
	loadIndexEvents()
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
	console.log(userInfo)
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
				document.querySelector('.user-container').style.display = 'none'
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
async function loadIndexEvents() {
	console.log('loadIndexEvents called')

	const res = await fetch('/index')
	const eventData = await res.json()

	// console.log(loveData);
	if (res.ok) {
		let indexHtml = ''
		//let index = 0;
		// console.log(eventData[0].id);
		//<img src="${event.image[0]}" class="card-img-top" alt="...">//
		//<h5 class="card-title">${event[0].title}</h5>
		//../../../${event[0].filename}
		for (let event of eventData) {
			const imageRes = await fetch(`/detail/event_id/${event.id}`)
			const loveRes = await fetch(`/detail/event_id/${event.id}/count`)

			// console.log(`/detail/event_id/${event.id}`);
			// console.log(loveRes);
			const imageData = (await imageRes.json()).data
			const loveData = (await loveRes.json()).data
			console.log(imageData)
			console.log(loveData)
			// const loveData = await loveRes.json();
			// console.log("loveData=" + loveData);
			// console.log("l==" + loveData);
			indexHtml += `<div class="card col-sm-2 col-sm-3" style="width: 18rem;" data_index="${
				event.id
			}">
        <img src="../../../${
			imageData[0].filename
		}" class="card-img-top" alt="...">
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
         
          
          <a class="btn btn-primary" data_index="${event.id}">GO!</a>
        </div>
        <div class="admin-corner" data_index="${
			event.id
		}"><i class="fa-solid fa-trash"></i><i class="fa-solid fa-pen-to-square"></i></div>
        ${
			loveData == 0
				? `<div class="love-container" data_index="${event.id}">
          <i class="fa-solid fa-heart-circle-plus" data_index="${event.id}"></i>
        </div>`
				: `<div class="love-container" data_index="${event.id}" >
            <i class="fa-solid fa-heart heart-red-solid" data_index="${event.id}"></i>
          
        </div>`
		}
      </div>`
			//index = event.id;
		}
		const eventContainer = document.querySelector('.event-container')
		eventContainer.innerHTML = indexHtml

		const cardContainer = document.querySelectorAll('.card')

		for (let card of cardContainer) {
			// let cardDiv=cardconatiner[card]
			const goBtn = card.querySelector('.btn-primary')
			const loveBtn = card.querySelector('.love-container')
			console.log(loveBtn)
			// console.log(cardDiv);
			// console.log("===" + goBtn);
			// console.log("===" + loveBtn);

			loveBtn.addEventListener('click', async (e) => {
				console.log('ABC')
				const resLogin = await fetch('/user/loginStatus')
				const userInfo = await resLogin.json()

				if (resLogin.ok) {
					if (!userInfo.hasOwnProperty('userId')) {
						const toastLiveExample =
							document.querySelector('.toast')

						const toast = new bootstrap.Toast(toastLiveExample)

						toast.show()
					} else {
						const element = e.target

						const eventIndex = element.getAttribute('data_index')
						console.log('clicked, index=' + eventIndex)
						const res = await fetch('/detail/love', {
							method: 'POST',
							body: JSON.stringify({
								eventIndex: eventIndex
							}),
							headers: {
								'content-type':
									'application/json; charset=utf-8'
							}
						})
						if (res.ok) {
							let abc = res.json()
							console.log('you get interested in this event!')
							console.log(abc)
							loadIndexEvents()
						}
					}
				}
			})

			goBtn.addEventListener('click', async (e) => {
				const element = e.target
				const eventIndex = element.getAttribute('data_index')
				document.location.href = `/detail/detailPage/id/${eventIndex}`
			})
		}
	}
}
// function setEventListenerOnCardDiv()
// function loadEventListenerOnEvent() {
//   const loveBtn = document.querySelector(".fa-heart-circle-plus");
//   console.log("loadEventListenerOnEvent");
//   loveBtn.addEventListener("click", async (e) => {
//     console.log("clicked");
//     const element = e.target;

//     const eventIndex = element.getAttribute("data-index");

//     const res = await fetch("/detail/love", {
//       method: "POST",
//       body: JSON.stringify({
//         eventIndex: eventIndex,
//       }),
//       headers: {
//         "content-type": "application/json; charset=utf-8",
//       },
//     });
//     if (res.ok) {
//       console.log("ok"); //// loadIndexEvents();
//     }
//   });

//   console.log("you get interested in this event!");
// }
// loadEventListenerOnEvent();

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
