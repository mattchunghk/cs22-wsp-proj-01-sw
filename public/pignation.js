var json = {
	Product: [
		{
			Key1: 'Value1 A'
		},
		{
			Key1: 'Value1 B'
		},
		{
			Key1: 'Value1 C'
		},
		{
			Key1: 'Value1 D'
		},
		{
			Key1: 'Value1 E'
		},
		{
			Key1: 'Value1 F'
		},
		{
			Key1: 'Value1 G'
		},
		{
			Key1: 'Value1 H'
		},
		{
			Key1: 'Value1 I'
		}
	]
}
const hihiJson = [
	{
		id: 3,
		user_id: 1,
		title: 'go to Peru',
		country: 'Peru',
		city: 'Machu Picchu',
		created_at: '2022-09-19T14:19:12.988Z',
		updated_at: '2022-09-19T14:19:12.988Z',
		introduction:
			'Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a 2,430-meter (7,970 ft) mountain ridge. It is located in the Machupicchu District within Urubamba Province above the Sacred Valley, which is 80 kilometers (50 mi) northwest of Cusco. The Urubamba River flows past it, cutting through the Cordillera and creating a canyon with a tropical mountain climate.',
		budget: 4000,
		start_date: '2023-02-15T16:00:00.000Z',
		end_date: '2023-02-20T16:00:00.000Z',
		people_quota: 4,
		is_sporty: true,
		is_luxury: false,
		is_relax: false,
		is_countryside: true
	},
	{
		id: 2,
		user_id: 1,
		title: 'Nostalgia Cuba ',
		country: 'Cuba',
		city: 'Havana',
		created_at: '2022-09-19T05:49:04.190Z',
		updated_at: '2022-09-19T05:49:04.190Z',
		introduction:
			'Havana was one of the vacation hot-spots of the Caribbean, and since Cuba reopened to tourism in the 1990s, it has become a popular destination once again, albeit with many fewer U.S. citizens, due to an almost total ban on travel maintained by the U.S. federal government. However, there will be lots of tourists at any time of year, so expect huge crowds and long lines in places.',
		budget: 3000,
		start_date: '2023-02-14T16:00:00.000Z',
		end_date: '2023-02-21T16:00:00.000Z',
		people_quota: 4,
		is_sporty: false,
		is_luxury: true,
		is_relax: true,
		is_countryside: false
	},
	{
		id: 1,
		user_id: 1,
		title: 'Pink beach Crazy Trip',
		country: 'Indonesia',
		city: 'Pink beach ',
		created_at: '2022-09-19T05:44:35.029Z',
		updated_at: '2022-09-19T05:44:35.029Z',
		introduction:
			'Locals call it the Red Beach, but better known internationally as the Pink Beach. The good news again, on this beach there is not building anything and not where people live. In the world, pink sandy beaches there are only 7 in the world, one of them on the island of Komodo. Pink sand is formed from pieces of red coral. But the truth is a kind of amoeba microscopic animals called Foraminifera which produce red or pink light on the reef. If we take a pinch of sand was then shown a red sand in between the white sand. When the waves sweeping the sand and pull it, then sand the color turned into dark pink. Cool! Grains of sand was smooth and soft, so delicious when walking or sunbathing on it.',
		budget: 200,
		start_date: '2023-01-02T16:00:00.000Z',
		end_date: '2023-01-10T16:00:00.000Z',
		people_quota: 4,
		is_sporty: false,
		is_luxury: false,
		is_relax: true,
		is_countryside: true
	}
]
async function loadDataJson() {
	const res = await fetch('/index')
	const eventData = await res.json()
	// console.log(eventData)
	return eventData
}
// let a = await loadDataJson()
// console.log(a)

loadDataJson().then((result) => {
	let data = result
	console.log(data)
	$('#list').pagination({
		// you call the plugin
		// dataSource: hihiJson, // pass all the data
		dataSource: data,
		showPageNumbers: true,
		pageSize: 2, // put how many items per page you want
		callback: function (data, pagination) {
			// data will be chunk of your data (json.Product) per page
			// that you need to display
			var wrapper = $('#list .wrapper').empty()
			$.each(data, async function (i, event) {
				const imageRes = await fetch(`/detail/event_id/${event.id}`)
				const loveRes = await fetch(
					`/detail/event_id/${event.id}/count`
				)

				// console.log(`/detail/event_id/${event.id}`);
				// console.log(loveRes);
				const imageData = (await imageRes.json()).data
				const loveData = (await loveRes.json()).data
				console.log(imageData)
				console.log(loveData)
				// const loveData = await loveRes.json();
				// console.log("loveData=" + loveData);
				// console.log("l==" + loveData);
				const indexHtml = `<div class="card col-sm-2 col-sm-3" style="width: 18rem;" data_index="${
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

				$('#list .wrapper').append(indexHtml)
			})
		}
	})
})
// console.log(data)

// const dataJson = loadDataJson()

// console.log(dataJson)

// for (let event of eventData) {
// 	const imageRes = await fetch(`/detail/event_id/${event.id}`)
// 	const loveRes = await fetch(`/detail/event_id/${event.id}/count`)

// 	// console.log(`/detail/event_id/${event.id}`);
// 	// console.log(loveRes);
// 	const imageData = (await imageRes.json()).data
// 	const loveData = (await loveRes.json()).data
// 	console.log(imageData)
// 	console.log(loveData)
// 	// const loveData = await loveRes.json();
// 	// console.log("loveData=" + loveData);
// 	// console.log("l==" + loveData);
// 	indexHtml += `<div class="card col-sm-2 col-sm-3" style="width: 18rem;" data_index="${
// 		event.id
// 	}">
// <img src="../../../${imageData[0].filename}" class="card-img-top" alt="...">
// <div class="card-body">
//   <h5 class="card-title">${event.title}</h5>
//   <p class="card-text">${event.introduction} </p>

//   <div class="icon-container">
//   ${
// 		event.is_sporty
// 			? `<div class="col-xl-2 icon-col">
// 	<div><i class="fa-solid fa-person-skiing
// 			  select-icons"></i>
// 	</div>
//   </div>`
// 			: ''
//   }
//   ${
// 		event.is_luxury
// 			? `<div class="col-xl-2  icon-col">
// <div><i class="fa-solid fa-dollar-sign
// 			select-icons"></i></div>
// </div>`
// 			: ''
//   }
//   ${
// 		event.is_relax
// 			? `
//   <div class="col-xl-2 icon-col">
// 	  <div><i class="fa-solid fa-spa select-icons"></i></div>
//   </div>`
// 			: ''
//   }
//   ${
// 		event.is_countryside
// 			? `<div class="col-xl-2 icon-col">
// <div><i class="fa-solid fa-mountain-sun
// 	select-icons"></i></div>
// </div>`
// 			: ''
//   }
//   </div>

//   <a class="btn btn-primary" data_index="${event.id}">GO!</a>
// </div>
// <div class="admin-corner" data_index="${
// 		event.id
// 	}"><i class="fa-solid fa-trash"></i><i class="fa-solid fa-pen-to-square"></i></div>
// ${
// 	loveData == 0
// 		? `<div class="love-container" data_index="${event.id}">
//   <i class="fa-solid fa-heart-circle-plus" data_index="${event.id}"></i>
// </div>`
// 		: `<div class="love-container" data_index="${event.id}" >
// 	<i class="fa-solid fa-heart heart-red-solid" data_index="${event.id}"></i>

// </div>`
// }
// </div>`
// 	//index = event.id;
// }
