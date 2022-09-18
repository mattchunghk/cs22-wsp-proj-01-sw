// import { io } from '../app'
console.log("js running");
window.onload = () => {
  init();
  loadCountryFunction();
  getFunctionBar();
  loginStatus();
};

function init() {
  document
    .querySelector("#event-form")
    .addEventListener("submit", createEvents);
  document
    .querySelector(".logo-container")
    .addEventListener("click", goHomePage);
  document
    .querySelector("#home-container")
    .addEventListener("click", goHomePage);
  document
    .querySelector(".log-out-container")
    .addEventListener("click", logout);
  document
    .querySelector(".log-in-container")
    .addEventListener("click", loginPage);
}

async function loadCountryFunction() {
  let countrySelectDiv = document.querySelector("#country-selection");
  const res = await fetch(`https://restcountries.com/v3.1/all`); // Fetch from the correct url
  const countries = await res.json();
  // countrySelectDiv.innerHTML += `<option selected>Country</option>`
  for (let country of countries) {
    countrySelectDiv.innerHTML += `<option value="${country.name.common}">${country.name.common}</option> `;
  }
}

async function createEvents(e) {
  console.log("createEvents called");
  e.preventDefault();
  const form = e.target;
  const title = form.tripTitle.value;
  const startDate = form.datepickerStart.value;
  const endDate = form.datepickerEnd.value;
  const country = form.country.value;
  const place = form.place.value;
  const ppl = form.ppl.value;
  const budget = form.budget.value;
  const intro = form.intro.value;

  const sporty = form.sporty.checked ? true : false;
  const luxury = form.luxury.checked ? true : false;
  const relaxed = form.relaxed.checked ? true : false;
  const countrySide = form.countrySide.checked ? true : false;

  const file1 = form.eventFile.files[0];
  const file2 = form.eventFile.files[1];
  const file3 = form.eventFile.files[2];
  const formData = new FormData();
  formData.append("title", title);
  formData.append("startDate", startDate);
  formData.append("endDate", endDate);
  formData.append("country", country);
  formData.append("place", place);
  formData.append("ppl", ppl);
  formData.append("budget", budget);
  formData.append("intro", intro);
  formData.append("sporty", sporty);
  formData.append("luxury", luxury);
  formData.append("relaxed", relaxed);
  formData.append("countrySide", countrySide);

  formData.append("image1", file1);
  formData.append("image2", file2);
  formData.append("image3", file3);

  // console.log('socket = ', socket)

  // formData.append('fromSocketId', socket.id)

  // const res = await fetch("/submit/formidable"); // Fetch from the correct url

  const res = await fetch("/submit/formidable", {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    form.reset();
    document.location.href = "/";
  }
}

async function getFunctionBar() {
  const pathnames = window.location.pathname.split("/");
  const pageId = pathnames[pathnames.length - 1];

  const res = await fetch(`/user/loginStatus`);
  const userInfo = await res.json();

  if (res.ok) {
    if (userInfo.hasOwnProperty("userId")) {
      document.querySelector(
        "#greeting-text"
      ).innerHTML = `Hi, ${userInfo.name}`;
      document.querySelector("#log-in-container").style.display = "none";
      document.querySelector("#log-out-container").style.display = "flex";
    } else {
      document.querySelector("#greeting-text").innerHTML = "";
      document.querySelector(".log-in-container").style.display = "flex";
      document.querySelector(".log-out-container").style.display = "none";
    }
  }
}

async function goHomePage() {
  window.location.href = "/";
}

async function logout() {
  const res = await fetch(`/user/logout`);
  if (res.ok) {
    document.querySelector("#greeting-text").innerHTML = "Logout successful";
    setTimeout(() => {
      document.querySelector("#greeting-text").innerHTML = "";
    }, 2000);

    getFunctionBar();
    document.querySelector("#event-form").reset();
    loginStatus();
  }
}

async function loginPage() {
  window.location.href = "/user/login.html";
}

async function loginStatus() {
  const res = await fetch(`/user/loginStatus`);
  const userInfo = await res.json();

  if (res.ok) {
    if (!userInfo.hasOwnProperty("userId")) {
      let allInputs = document.querySelectorAll(".form-control");
      for (let allInput of allInputs) {
        allInput.disabled = true;
      }
      let allChecks = document.querySelectorAll(".form-check-input");
      for (let allCheck of allChecks) {
        allCheck.disabled = true;
      }
      document.querySelector("#btn-submit").innerHTML = "Please Login first";
      document.querySelector("#btn-submit").disabled = true;
      document.querySelector("#country-selection").disabled = true;
    }
  }
}
