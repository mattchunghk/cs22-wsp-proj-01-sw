async function loadIndexEvents() {
  console.log("loadIndexEvents called");
  const res = await fetch("/index");
  const eventData = await res.json();

  if (res.ok) {
    let indexHtml = "";

    console.log(eventData);
    //<img src="${event.image[0]}" class="card-img-top" alt="...">//
    //<h5 class="card-title">${event[0].title}</h5>
    for (let event of eventData) {
      indexHtml += `<div class="card" style="width: 18rem;" data_index="${
        event.id
      }">
        <img src="../asset/02event.jpg" class="card-img-top" alt="...">
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
         
          
          <a href="#" class="btn btn-primary">Join Me!</a>
        </div>
        <div class="like-container">
          <i class="fa-solid fa-heart-circle-plus"></i>
        </div>
      </div>`;
    }
    const eventContainer = document.querySelector(".event-container");
    eventContainer.innerHTML = indexHtml;
  }
}
loadIndexEvents();

function loadEventListenerOnEvent() {
  const loveBtn = document.querySelector.apply("fa-heart-circle-plus");

  loveBtn.addEventListener("click", async (e) => {
    const element = e.target;
    const eventIndex = element.getAttribute("data-index");

    const res = await fetch("/detail/love", {
      method: "Get",
      body: JSON.stringify({
        eventIndex: eventIndex,
      }),
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
    if (res.ok) {
      console.log("ok"); //// loadIndexEvents();
    }
  });

  console.log("you get interested in this event!");
}
