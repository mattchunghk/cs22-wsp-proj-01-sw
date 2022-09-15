window.onload = () => {
    loadMessages()
}



const socket = io.connect();
socket.on("new-message", (data) => {
    console.log(data);
    loadMessages()
})
socket.on("new-message-update", (data) => {
    console.log(data);
    loadMessages()
})
socket.on("message-delete", (data) => {
    console.log(data);
    loadMessages()
})

//寫留言

document.querySelector('#messages-form')
    .addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log("#messages-form");
        const messageData = new FormData(event.currentTarget);
        console.log(messageData);

        const res = await fetch('/messages/create', {
            method: 'POST',
            body: messageData,
        })
        const result = await res.text()
        if (res.status === 200) {
            console.log(result);
        }

    })

//拎messages & images
async function loadMessages() {
    const messagesResult = await fetch('/messages/get');
    const messagesJson = await messagesResult.json();

    // const messagesLikeResult = await fetch('/message_like/get');
    // const messagesLikeJson = await messagesLikeResult.json();
    // console.log(messagesLikeJson);

    const messagesContainer = document.querySelector('#messages_container');
    messagesContainer.innerHTML = ""
    // ${memo.image ? `<img src="http://localhost:8080/uploads/${memo.image}" alt="Image" /> ` : ""}

    for (let message of messagesJson) {

        const messageId = message.id
        let imageHtml = ''
        // console.log(message.images);
        if (message.images != "") {
            for (let messagesImage of message.images) {
                // console.log(messagesImage);
                imageHtml += `
            <div class="carousel-item active">
                    <img src="http://localhost:8080/${messagesImage}" class=" d-block w-100 " alt="..."> 
            </div>`

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
                 </div>`
        } else {
            messagesContainer.innerHTML += `
        <div class="messageAllDivs" >
            <div class="row heading-setting">
                <div for="exampleFormControlTextarea1" class="form-label col-md-3" >${message.heading}</div>
                <div class="col-md-3"> Name: <span>  ${message.user_id}</span></div>
                <div class="col-md-4"> Date: <span> ${message.created_at}1</span></div>
            </div>
                <div class="row">
                    <div class="col-md-12 box1">
                        <textarea class="form-control message-input readtext " id="exampleFormControlTextarea1" placeholder="输入文字"
                            cols="110" rows="6">${message.comment}</textarea>
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
        
                `
        }
    }


    const messagesAllDivs = document.querySelectorAll('.messageAllDivs')
    for (let messagesDivs of messagesAllDivs) {

        const editBtn = await messagesDivs.querySelector('.edit-btn')
        const deleteBtn = await messagesDivs.querySelector('.delete-btn')
        // const angryBtn = await messagesDivs.querySelector('.angry-btn')
        const likeBtn = await messagesDivs.querySelector('.like-btn')
        // console.log(deleteBtn);

        // Call Edit
        editBtn.addEventListener('click', async (event) => {

            const messageEdit = messagesDivs.querySelector('.message-input').value
            // console.log(messagesDivs.querySelector('.message-input').disabled);
            // messagesDivs.querySelector('.message-input').classList.toggle('readonly');

            console.log(messageEdit);
            const editIndex = event.currentTarget.getAttribute('index')
            // console.log(editIndex);
            // Call Edit API
            const messageEditRes = await fetch('/message/update', {
                method: 'PUT',
                body: JSON.stringify({
                    "messages_comment": messageEdit,
                    "index": editIndex
                }),//記得JSON出寫返headers
                headers: { 'Content-Type': 'application/json' },
            })
            if (messageEditRes.ok) {
                loadMessages()
            }
        })

        //Call Delete
        deleteBtn.addEventListener('click', async (event) => {
            const editIndex = event.currentTarget.getAttribute('index')
            // console.log(editIndex);
            // Call Delete API
            const messageEditRes = await fetch('/message/update', {
                method: 'DELETE',
                body: JSON.stringify({
                    "index": editIndex
                }),//記得JSON出寫返headers
                headers: { 'Content-Type': 'application/json' },
            })
            if (messageEditRes.ok) {
                loadMessages()
            }
        })


        // let likePattern = true;
        likeBtn.addEventListener('click', async (event) => {
            // Call Like API
            console.log(event.currentTarget.getAttribute('index'));
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

            const editIndex = event.currentTarget.getAttribute('index')

            const messageEditRes = await fetch('/message/like', {
                method: 'POST',
                body: JSON.stringify({
                    "index": editIndex
                }),//記得JSON出寫返headers
                headers: { 'Content-Type': 'application/json' },
            })
            if (messageEditRes.ok) {
                loadMessages()
            }
        })

    }
}



loadMessages()