// import { io } from '../app'
console.log("js running");
window.onload = () => {
    init();
};

function init() {
    document.querySelector('#event-form').addEventListener('submit', createEvents)
}


async function createEvents(e) {
    console.log("createEvents called");
    e.preventDefault()
    const form = e.target
        // const title = form.tripTitle.value
        // const file = form.eventFile.files[0]
        // const formData = new FormData()
        // formData.append('title', title)
        // formData.append('image', file)
        // console.log('socket = ', socket)

    // formData.append('fromSocketId', socket.id)

    const res = await fetch("/submit/formidable"); // Fetch from the correct url

    // const res = await fetch('/submit/formidable', {
    //     method: 'POST',
    //     body: formData
    // })



    if (res.ok) {
        form.reset()
            // res.send("Upload successful");
    }
}