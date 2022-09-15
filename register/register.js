// import { io } from '../app'
console.log("js running");
window.onload = () => {
    init();
};

function init() {
    document.querySelector(".login-form").addEventListener("submit", register);
    document.querySelector(".back-home-form").addEventListener("click", backHome);
}

async function register(event) {
    event.preventDefault();

    // Serialize the Form afterwards
    const form = event.target;

    const formObject = {};
    const loginText = document.querySelector(".login-text");
    formObject["username"] = form.username.value;
    formObject["password"] = form.password.value;
    formObject["checkPassword"] = form.checkPassword.value;
    const res = await fetch("/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
    });

    if (res.ok) {
        loginText.innerHTML = "Sign-up successful!";
        setTimeout(() => (window.location.href = "/"), 1000);
        loginText.style.fontSize = "1.3rem";
    } else {
        loginText.innerHTML = "Invalid username or password";
        loginText.style.fontSize = "1.3rem";
        setTimeout(() => (loginText.style.fontSize = "1.5rem"), 1000);
        setTimeout(() => (loginText.innerHTML = "Sign Up"), 1000);
    }
}

function backHome() {
    window.location.href = "/";
}