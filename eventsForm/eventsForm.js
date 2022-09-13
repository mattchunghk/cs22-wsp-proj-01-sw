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
    const title = form.tripTitle.value
    const startDate = form.datepickerStart.value
    const endDate = form.datepickerEnd.value
    const country = form.country.value
    const place = form.place.value
    const ppl = form.ppl.value
    const budget = form.budget.value

    const file1 = form.eventFile.files[0]
    const file2 = form.eventFile.files[1]
    const file3 = form.eventFile.files[2]
    const formData = new FormData()
    formData.append('title', title)
    formData.append('startDate', startDate)
    formData.append('endDate', endDate)
    formData.append('country', country)
    formData.append('place', place)
    formData.append('ppl', ppl)
    formData.append('budget', budget)


    formData.append('image1', file1)
    formData.append('image2', file2)
    formData.append('image3', file3)


    // console.log('socket = ', socket)

    // formData.append('fromSocketId', socket.id)

    // const res = await fetch("/submit/formidable"); // Fetch from the correct url

    const res = await fetch('/submit/formidable', {
        method: 'POST',
        body: formData
    })



    if (res.ok) {
        form.reset()
            // res.send("Upload successful");
    }
}