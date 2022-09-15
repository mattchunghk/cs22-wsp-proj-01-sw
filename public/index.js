window.onload = () => {
  loadIndexEvents();
  loadLoginStatus();
};
async function loadLoginStatus() {
  const userRes = await fetch(`/user/loginStatus`);

  const userInfo = await userRes.json();
  console.log(userInfo);
  if (userRes.ok) {
    if (userInfo.hasOwnProperty("userId")) {
      document.querySelector(
        ".show-username"
      ).innerHTML = `Hi, ${userInfo.name}`;
      console.log(userInfo.name);
      document.querySelector(".login-in").style.display = "none";
      document.querySelector(".logged-in-okay").style.display = "flex";
      console.log("you are logged in");
      // if (userInfo.isAdmin) {
      //   document.querySelector(".admin-container").style.display = "flex";
      // } else if (userInfo.isAdmin == null || userInfo.isAdmin == false) {
      //   document.querySelector(".admin-container").style.display = "none";
      // }
    } else {
      document.querySelector(".show-username").innerHTML = "";
      // document.querySelector("#admin-container").style.display = "none";
      document.querySelector(".login-in").style.display = "flex";
      document.querySelector(".logged-in-okay").style.display = "none";
    }
  }
}
async function loadIndexEvents() {
  console.log("loadIndexEvents called");

  // const pathnames = window.location.pathname.split("/");
  // const pageId = pathnames[pathnames.length - 1];
  // console.log("pageID= " + pageId);

  const res = await fetch("/index");
  const eventData = await res.json();

  if (res.ok) {
    let indexHtml = "";
    //let index = 0;
    console.log(eventData[0].id);
    //<img src="${event.image[0]}" class="card-img-top" alt="...">//
    //<h5 class="card-title">${event[0].title}</h5>
    //../../../${event[0].filename}
    for (let event of eventData) {
      const imageRes = await fetch(`/detail/event_id/${event.id}`);
      console.log(`/detail/event_id/${event.id}`);
      // console.log(imageRes);
      const imageData = await imageRes.json();
      console.log(imageData);
      indexHtml += `<div class="card" style="width: 18rem;" data_index="${
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
              : ""
          }
          ${
            event.is_luxury
              ? `<div class="col-xl-2  icon-col">
        <div><i class="fa-solid fa-dollar-sign
                    select-icons"></i></div>
    </div>`
              : ""
          }
          ${
            event.is_relax
              ? `             
          <div class="col-xl-2 icon-col">
              <div><i class="fa-solid fa-spa select-icons"></i></div>
          </div>`
              : ""
          }
          ${
            event.is_countryside
              ? `<div class="col-xl-2 icon-col">
<div><i class="fa-solid fa-mountain-sun
            select-icons"></i></div>
</div>`
              : ""
          }
          </div>
         
          
          <a href="#" class="btn btn-primary" data_index="${event.id}">GO!</a>
        </div>
        <div class="admin-corner" data_index="${
          event.id
        }"><i class="fa-solid fa-trash"></i><i class="fa-solid fa-pen-to-square"></i></div>
        <div class="love-container" data_index="${event.id}">
          <i class="fa-solid fa-heart-circle-plus" data_index="${event.id}"></i>
        </div>
      </div>`;
      //index = event.id;
    }
    const eventContainer = document.querySelector(".event-container");
    eventContainer.innerHTML = indexHtml;

    const cardContainer = document.querySelectorAll(".card");

    for (card in cardContainer) {
      const cardDiv = cardContainer[card];
      const goBtn = cardDiv.querySelector(".btn-primary");
      const loveBtn = cardDiv.querySelector(".love-container");

      console.log(cardDiv);

      loveBtn.addEventListener("click", async (e) => {
        const element = e.target;

        const eventIndex = element.getAttribute("data_index");
        console.log("clicked, index=" + eventIndex);
        const res = await fetch("/detail/love", {
          method: "POST",
          body: JSON.stringify({
            eventIndex: eventIndex,
          }),
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        });
        if (res.ok) {
          loadIndexEvents();
        }
      });

      goBtn.addEventListener("click", async (e) => {
        const element = e.target;
        const eventIndex = element.getAttribute("data_index");
        document.location.href = `/detail/detailPage/id/${eventIndex}`;
      });

      console.log("you get interested in this event!");
    }
  }
}

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
