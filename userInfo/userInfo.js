function init() {loadLikeEvents()}


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
		}
	}
}
async function loadUserInfo(){
    const res = await fetch(`/user/loginStatus`)
	const userInfo = await res.json()
    if (res.ok) {
		if (userInfo.hasOwnProperty('userId')) {
            document.querySelector(".show-username")
        
        }}
}


async function loadLikeEvents(){
    // const event=req.params.table;
    const res= await fetch("/detail/userPage/event")
    const resUser=await res.json();
    

  
    if(res.ok){
        let userHtml="";
        console.log(resUser)
        for (let event of resUser){
            userHtml+=`<div class="event-display">
            <img class="event-photo-conatiner" src="../../../${
                event[0].filename
              }"></img>
            <div class="event-content">
              <h4 class="event-title">title<span id="event-title-p">${event.title}</span></h4> 
              <div class="event-country">Iceland<span id="event-title-country">${event.country} ${event.city}</span></div>
              <div class="event-date">go to Iceland<span id="event-title-date">${event.start_date}</span></div>

              </p>
            </div>
          </div>`
        }
    }
    
    const eventContainer = document.querySelector(".event-container");
    eventContainer.innerHTML=userHtml;
}

