// import { io } from '../app'
console.log("js running");
window.onload = () => {
    init();
};

function init() {
    loadEvents()
    myMap()
}


async function loadEvents() {
    console.log("loadEvents called");



    const res = await fetch("/detail/event_id/1"); // Fetch from the correct url
    const events = await res.json();
    console.log(events);

    if (res.ok) {
        let detailContainer = document.querySelector('.main-container')
        detailContainer
    }
}