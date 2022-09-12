// import { io } from '../app'
console.log("js running");
window.onload = () => {
    init();
};

function init() {
    loadEvents()
}


async function loadEvents() {
    console.log("loadEvents called");



    const res = await fetch("/detail/event_id/1"); // Fetch from the correct url
    const event = await res.json();
    console.log(event.title);

    if (res.ok) {
        let detailContainer = document.querySelector('#main-container')
        detailContainer.innerHTML = `<div class="img-container">
        <img src="./pink-beach-komodo-1920.jpg" class="d-block w-100
                form-photo" alt="form-photo">
    </div>

    <div class="row detail-content-row">
        <div class="col-md-8 detail-content">
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
                        <span class="icon-text" id="icon-money">$US${event[0].budget}</span></div>
                </div>
                <div class="col-xxl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="detail-detail-content-element"> <i class="fa-solid fa-users"></i>
                        <span class="icon-text" id="icon-raking">8/${event[0].people_quota}</span>
                    </div>
                </div>
                <div class="col-xxl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="detail-detail-content-element"> <i class="fa-solid fa-location-dot"></i>
                        <span class="icon-text" id="icon-country">${event[0].country}</span>
                    </div>
                </div>
                <div class="col-xxl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="detail-detail-content-element"> <i class="fa-solid
                                fa-plane-departure"></i>
                        <span class="icon-text" id="icon-depart">${new Date(event[0].start_date).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="col-xxl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="detail-detail-content-element"> <i class="fa-solid
                                fa-plane-arrival"></i>
                        <span class="icon-text" id="icon-arrival">${new Date(event[0].end_date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div class="detail-introduction">
            ${event[0].introduction}</div>
            <div class="row icon-row">
            ${event[0].is_sporty?`<div class="col-xl-3 col-md-6 col-6 icon-col">
            <div><i class="fa-solid fa-person-skiing
                        select-icons"></i>Sport activities
            </div>
        </div>`:""}
        ${event[0].is_luxury?`<div class="col-xl-3 col-md-6 col-6 icon-col">
        <div><i class="fa-solid fa-dollar-sign
                    select-icons"></i>Luxury</div>
    </div>`:""}

    ${event[0].is_relax?`             
    <div class="col-xl-3 col-md-6 col-6 icon-col">
        <div><i class="fa-solid fa-spa select-icons"></i>Relax</div>
    </div>`:""}

${event[0].is_countryside?`<div class="col-xl-3 col-md-6 col-6 icon-col">
<div><i class="fa-solid fa-mountain-sun
            select-icons"></i>Country Side</div>
</div>`:""}
        
            
                
            
   

            </div>
        </div>
        <div class="col-md-4 map">
            <iframe width="100%" height="400" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDgzJsIne7hMjjk8yGSPloiQ_FYdNr-g-&q=${event[0].city.trim().split(' ').join('+')}"></iframe>
            <div class="d-grid gap-2 ">
                <button class="btn btn-primary btn-submit" type="button">Join</button>
            </div>
        </div>
    </div>`
    }

    res.redirect("/detail/detailPage.html")
}