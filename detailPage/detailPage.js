// import { io } from '../app'
console.log("js running");
window.onload = () => {
    init();
};

function init() {
    loadEvents();
    loadMessages();
    getFunctionBar();
    document
        .querySelector(".log-out-container")
        .addEventListener("click", logout);
    document
        .querySelector(".log-in-container")
        .addEventListener("click", loginPage);
    document
        .querySelector(".logo-container")
        .addEventListener("click", goHomePage);
}

const socket = io.connect();
socket.on("new-message", (data) => {
    console.log(data);
    loadMessages();
});
socket.on("new-message-update", (data) => {
    console.log(data);
    loadMessages();
});
socket.on("message-delete", (data) => {
    console.log(data);
    loadMessages();
});

async function goHomePage() {
    window.location.href = "/";
}
async function getFunctionBar() {
    const pathnames = window.location.pathname.split("/");
    const pageId = pathnames[pathnames.length - 1];

    const res2 = await fetch(`/detail/event_id/${pageId}`); // Fetch from the correct url
    const event = await res2.json();
    const res = await fetch(`/user/loginStatus`);
    const userInfo = await res.json();

    if (res.ok) {
        if (userInfo.hasOwnProperty("userId")) {
            document.querySelector(".messages-form-row").style.display = "flex";
            document.querySelector(
                "#greeting-text"
            ).innerHTML = `Hi, ${userInfo.name}`;
            document.querySelector("#log-in-container").style.display = "none";
            document.querySelector("#log-out-container").style.display = "flex";

            if (event[0].user_id == userInfo.userId) {
                document.querySelector(".delete-container").style.display = "flex";
            } else {
                document.querySelector(".delete-container").style.display = "none";
            }
            if (userInfo.isAdmin) {
                document.querySelector("#admin-container").style.display = "flex";
                document.querySelector(".delete-container").style.display = "flex";
            } else if (userInfo.isAdmin == null || userInfo.isAdmin == false) {
                document.querySelector("#admin-container").style.display = "none";
            }
        } else {
            document.querySelector("#greeting-text").innerHTML = "";
            document.querySelector("#admin-container").style.display = "none";
            document.querySelector(".delete-container").style.display = "none";
            document.querySelector(".log-in-container").style.display = "flex";
            document.querySelector(".log-out-container").style.display = "none";
            document.querySelector(".messages-form-row").style.display = "none";
        }
    }
}

async function loginPage() {
    window.location.href = "/user/login.html";
}

async function logout() {
    const res = await fetch(`/user/logout`);
    if (res.ok) {
        document.querySelector("#greeting-text").innerHTML = "Logout successful";
        setTimeout(() => {
            document.querySelector("#greeting-text").innerHTML = "";
        }, 2000);
        loadMessages();
        getFunctionBar();
    }
}

async function loadEvents() {
    console.log("loadEvents called");
    const pathnames = window.location.pathname.split("/");
    const pageId = pathnames[pathnames.length - 1];

    const res = await fetch(`/detail/event_id/${pageId}`); // Fetch from the correct url
    const event = await res.json();

    if (res.ok) {
        let detailContainer = document.querySelector("#main-container");

        detailContainer.innerHTML = `
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="true">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        </div>
        <div class="carousel-inner">

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
                        <div class="detail-detail-content-element"><i class="fa-regular fa-heart"></i>
                            <spain>11 interested
                            </spain>
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
                        select-icons"></i>Sport activities
            </div>
        </div>`
                : ""
            }

        ${
          event[0].is_luxury
            ? `<div class="col-xl-3 col-md-6 col-6 icon-col">
        <div><i class="fa-solid fa-dollar-sign
                    select-icons"></i>Luxury</div>
    </div>`
            : ""
        }

    ${
      event[0].is_relax
        ? `             
    <div class="col-xl-3 col-md-6 col-6 icon-col">
        <div><i class="fa-solid fa-spa select-icons"></i>Relax</div>
    </div>`
        : ""
    }

${
  event[0].is_countryside
    ? `<div class="col-xl-3 col-md-6 col-6 icon-col">
<div><i class="fa-solid fa-mountain-sun
            select-icons"></i>Country Side</div>
</div>`
    : ""
}
            </div>
        </div>
        <div class="col-lg-4 col-md-12 map">
            <iframe width="100%" height="400" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDgzJsIne7hMjjk8yGSPloiQ_FYdNr-g-&q=${event[0].city
              .trim()
              .split(" ")
              .join("+")}"></iframe>
            <div class="d-grid gap-2 ">
                <button class="btn btn-primary btn-submit" id="join-btn">Join</button>
            </div>
        </div>
    </div>
    


    
    
    `;

    let imgInner = document.querySelector(".carousel-inner");
    let imgDot = document.querySelector(".carousel-indicators");
    imgInner.innerHTML = "";
    for (let i = 0; i < event.length; i++) {
      if (event[i].filename == null) {
        imgInner.innerHTML += "";
      } else {
        if (i == 0) {
          imgInner.innerHTML += ` <div class="carousel-item active">
                <img src="../../../${event[i].filename}" class="d-block w-100" alt="...">
              </div>`;
        } else {
          imgDot.innerHTML += `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" aria-label="Slide ${i}"></button>`;
          imgInner.innerHTML += `<div class="carousel-item">
                <img src="../../../${event[i].filename}" class="d-block w-100 form-photo" alt="">
              </div>`;
        }
      }
    }
    let joinBtnDiv = document.querySelector("#join-btn");
    let joinedPplSpan = document.querySelector("#icon-raking");

    async function joinCount() {
      const res = await fetch(`/detail/joinCount/?eventId=${pageId}`);
      const joinCount = await res.json();
      if (res.ok) {
        joinedPplSpan.innerHTML = `${joinCount[1].count}/${event[0].people_quota}`;
        if (joinCount[0] == false) {
          joinBtnDiv.innerHTML = "Please Login first";
          joinBtnDiv.disabled = true;
        } else {
          if (joinCount[0].count == 1) {
            if (joinCount[0].count == 1) {
              joinBtnDiv.innerHTML = "leave";
            } else {
              joinBtnDiv.innerHTML = "Join";
            }
          } else {
            if (joinCount[1].count >= event[0].people_quota) {
              joinBtnDiv.innerHTML = "Full";
              joinBtnDiv.disabled = true;
            } else {
              joinBtnDiv.innerHTML = "Join";
            }
          }
        }
      }
    }
    joinCount();

    joinBtnDiv.addEventListener("click", async function (event) {
      const res = await fetch(`/detail/join/?eventId=${pageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        joinCount();
      }
    });
  }
}

//寫留言

document
  .querySelector("#messages-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const pathnames = window.location.pathname.split("/");
    const pageId = pathnames[pathnames.length - 1];
    const messageData = new FormData(event.currentTarget);
    console.log(messageData);

    const res = await fetch(`/messages/create/${pageId}`, {
      method: "POST",
      body: messageData,
    });
    const result = await res.text();
    if (res.status === 200) {
      console.log(result);
    }
  });

//拎messages & images
async function loadMessages() {
  const pathnames = window.location.pathname.split("/");
  const pageId = pathnames[pathnames.length - 1];
  const messagesResult = await fetch(`/messages/get/${pageId}`);
  const messagesJson = await messagesResult.json();

  console.log(messagesJson);

  // const messagesLikeResult = await fetch('/message_like/get');
  // const messagesLikeJson = await messagesLikeResult.json();
  // console.log(messagesLikeJson);

  const messagesContainer = document.querySelector("#messages_container");
  messagesContainer.innerHTML = "";
  // ${memo.image ? `<img src="http://localhost:8080/uploads/${memo.image}" alt="Image" /> ` : ""}

  for (let message of messagesJson) {
    const messageId = message.id;
    let imageHtml = "";
    // console.log(message.images);
    if (message.images != "") {
      for (let messagesImage of message.images) {
        // console.log(messagesImage);
        imageHtml += `
            <div class="carousel-item active">
                    <img src="http://localhost:8080/${messagesImage}" class=" d-block w-100 " alt="..."> 
            </div>`;
      }
      messagesContainer.innerHTML += `
        <div class="messageAllDivs" >
            <div class="row heading-setting">
                <div for="exampleFormControlTextarea1" class="form-label col-md-3" >${message.heading}</div>
                <div class="col-md-3"> Name: <span> ${message.user_id}</span></div>
                <div class="col-md-4"> Date: <span> ${message.created_at}</span></div>
            </div>
                <div class="row">
                    <div class="col-md-6 box1">
                        <textarea class="form-control message-input readtext" id="exampleFormControlTextarea1" placeholder="输入文字"
                            cols="110" rows="10"  >${message.comment}</textarea>
                        <div class="row button-div">
                            <div class="col-md-3">
                                <button class='delete-btn ' index="${message.id}">
                                    <i class="bi bi-trash3-fill" index="${message.id}"></i>
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button class='edit-btn' index="${message.id}">
                                    <i class="bi bi-pencil-square" index="${message.id}"></i>
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button class='angry-btn' index="${message.id}">
                                    <i class="bi bi-emoji-angry index="${message.id}"></i>
                                    <span class="angryview" id="angry_value" index="${message.id}">0</span>
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button class='like-btn' index="${message.id}">
                                    <i class="bi bi-emoji-heart-eyes" index="${message.id}"></i>
                                    <span class="likeview" id="like_value" index="${message.id}">${message.favorite_count}</span>
                                </button>
                            </div>
                        </div>

                    </div>
        
                    
                    <div class="col-md-6 images-setting">
                    <div id="carouselExampleControls${message.id}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                      ${imageHtml}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls${message.id}" data-bs-slide="prev">
                      <span class="" aria-hidden="true"></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls${message.id}" data-bs-slide="next">
                      <span class="" aria-hidden="true"></span>
                      <span class="visually-hidden">Next</span>
                    </button>
                  </div>
                 </div>
                 </div>`;
    } else {
      messagesContainer.innerHTML += `
        <div class="messageAllDivs" >
            <div class="row heading-setting">
                <div for="exampleFormControlTextarea1" class="form-label col-md-3" >${
                  message.heading
                }</div>
                <div class="col-md-3"> Name: <span>  ${
                  message.user_id
                }</span></div>
                <div class="col-md-4"> Date: <span> ${
                  message.created_at
                }1</span></div>
            </div>
                <div class="row">
                    <div class="col-md-12 box1">
                        <textarea class="form-control message-input readtext " id="exampleFormControlTextarea1" placeholder="输入文字"
                            cols="110" rows="6">${message.comment}</textarea>
                        <div class="row button-div">
                            <div class="col-md-3">
                                <button class='delete-btn ' index="${
                                  message.id
                                }">
                                    <i class="bi bi-trash3-fill" index="${
                                      message.id
                                    }"></i>
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button class='edit-btn' index="${message.id}">
                                    <i class="bi bi-pencil-square" index="${
                                      message.id
                                    }"></i>
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button class='angry-btn' index="${message.id}">
                                    <i class="bi bi-emoji-angry index="${
                                      message.id
                                    }"></i>
                                    <span class="angryview" id="angry_value" index="${
                                      message.id
                                    }">0</span>
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button class='like-btn' index="${message.id}">
                                    <i class="bi bi-emoji-heart-eyes" index="${
                                      message.id
                                    }"></i>
                                    <span class="likeview" id="like_value" index="${
                                      message.id
                                    }">${message.favorite_count - 1}</span>
                                </button>
                            </div>
                        </div>

                    </div>
        
                `;
    }
  }

  const messagesAllDivs = document.querySelectorAll(".messageAllDivs");
  for (let messagesDivs of messagesAllDivs) {
    const editBtn = await messagesDivs.querySelector(".edit-btn");
    const deleteBtn = await messagesDivs.querySelector(".delete-btn");
    // const angryBtn = await messagesDivs.querySelector('.angry-btn')
    const likeBtn = await messagesDivs.querySelector(".like-btn");
    // console.log(deleteBtn);

    // Call Edit
    editBtn.addEventListener("click", async (event) => {
      const messageEdit = messagesDivs.querySelector(".message-input").value;
      // console.log(messagesDivs.querySelector('.message-input').disabled);
      // messagesDivs.querySelector('.message-input').classList.toggle('readonly');

      console.log(messageEdit);
      const editIndex = event.currentTarget.getAttribute("index");
      // console.log(editIndex);
      // Call Edit API
      const messageEditRes = await fetch("/message/update", {
        method: "PUT",
        body: JSON.stringify({
          messages_comment: messageEdit,
          index: editIndex,
        }), //記得JSON出寫返headers
        headers: { "Content-Type": "application/json" },
      });
      if (messageEditRes.ok) {
        loadMessages();
      }
    });

    //Call Delete
    deleteBtn.addEventListener("click", async (event) => {
      const editIndex = event.currentTarget.getAttribute("index");
      // console.log(editIndex);
      // Call Delete API
      const messageEditRes = await fetch("/message/update", {
        method: "DELETE",
        body: JSON.stringify({
          index: editIndex,
        }), //記得JSON出寫返headers
        headers: { "Content-Type": "application/json" },
      });
      if (messageEditRes.ok) {
        loadMessages();
      }
    });

    // let likePattern = true;
    likeBtn.addEventListener("click", async (event) => {
      // Call Like API
      console.log(event.currentTarget.getAttribute("index"));
      // let likeview = messagesDivs.querySelector('.likeview');
      // let likeview_num = messagesDivs.querySelector('.likeview').innerHTML
      // console.log(likePattern)
      // console.log(likeview);
      // if (likePattern) {
      //     console.log(likePattern)
      //     likeview.innerHTML = parseInt(likeview_num) + 1
      //     likePattern = false
      //     console.log(likePattern)
      //     // return
      // } else {
      //     likeview.innerHTML = parseInt(likeview_num) - 1
      //     likePattern = true
      //     console.log(likePattern)
      //     // return

      const editIndex = event.currentTarget.getAttribute("index");

      const messageEditRes = await fetch("/message/like", {
        method: "POST",
        body: JSON.stringify({
          index: editIndex,
        }), //記得JSON出寫返headers
        headers: { "Content-Type": "application/json" },
      });
      if (messageEditRes.ok) {
        loadMessages();
      }
    });
  }
}