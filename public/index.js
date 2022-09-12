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
      indexHtml += `<div class="card" style="width: 18rem;" data_index="${event.id}">
        <img src="../asset/02event.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${event.title}</h5>
          <p class="card-text">${event.introduction} </p>
          <div><i class="fa-solid fa-dollar-sign
          select-icons"></i></div>
          <a href="#" class="btn btn-primary">Join Me!</a>
        </div>
      </div>`;
    }
    const eventContainer = document.querySelector(".event-container");
    eventContainer.innerHTML = indexHtml;
  }
}
loadIndexEvents();
