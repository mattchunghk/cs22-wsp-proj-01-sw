document.querySelector("#admin-form").addEventListener("submit", async function login(event) {
    event.preventDefault();

    // Serialize the Form afterwards
    const form = event.target;
    const formObject = {};
    const adminText = document.querySelector(".admin-txt");
    formObject["username"] = form.username.value;
    formObject["password"] = form.password.value;
    const res = await fetch("/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
    });
})