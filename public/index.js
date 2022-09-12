async function loadIndexEvents() {
  console.log("loadIndexEvents called");
  const res = await fetch("/index");
  const eventData = await res.json();

  if (res.ok) {
    const eventContainer = document.querySelector(".event-container");
    eventContainer.innerHTML = indexHtml;
    console.log(eventData);
    let indexHtml = " ";
    for (let event of eventData) {
      indexHtml += `<div class="card" style="width: 18rem;" data_index="${event.id}">
        <img src="${event.image[0]}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${event[0].title}</h5>
          <p class="card-text">${event.introduction} </p>
          <div><i class="fa-solid fa-dollar-sign
          select-icons"></i><i class="fa-solid fa-mountain-sun
          select-icons"><i class="fa-solid fa-spa select-icons"></i></div>
          <a href="#" class="btn btn-primary">Join Me!</a>
        </div>
      </div>`;
    }
  }
}
loadIndexEvents();
