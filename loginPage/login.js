// import { io } from '../app'
console.log("js running");
window.onload = () => {
    init();
};

function init() {
    document.querySelector(".login-form").addEventListener("submit", login)
    document.querySelector(".back-home-form").addEventListener('click', backHome)
}


async function login(event) {
    event.preventDefault();

    // Serialize the Form afterwards
    const form = event.target;
    const formObject = {};
    const loginText = document.querySelector(".login-text");
    formObject["username"] = form.username.value;
    formObject["password"] = form.password.value;
    const res = await fetch("/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
    });

    if (res.ok) {
        loginText.innerHTML = "Login successful!"
        setTimeout(() => document.location.href = "/", 1000)
        loginText.style.fontSize = "1.3rem";

    } else {
        loginText.innerHTML = "Invalid username or password"
        loginText.style.fontSize = "1.3rem";
    }
}

function backHome() {
    document.location.href = "/"
}