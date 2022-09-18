console.log("js running");

window.onload = () => {
  init();
};

function init() {
  loadAdmin();
  getFunctionBar();
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

const socket = io.connect();
socket.on("new-user-update", (data) => {
  console.log(data);
  loadAdmin();
});

//拎 admin
async function loadAdmin() {
  const adminResult = await fetch("/user/admin");
  const adminResultJson = await adminResult.json();
  console.log(adminResultJson);
  const adminResultContainer = document.querySelector("#admin_container");
  adminResultContainer.innerHTML = "";

  const userResultContainer = document.querySelector("#user_container");
  userResultContainer.innerHTML = "";

  for (let admin of adminResultJson) {
    console.log(admin.id);
    if (!admin.is_admin) {
      userResultContainer.innerHTML += `
            <div class="col-md-12 userAllDivs">
            <div>
              <span class="user-name">Username: </span><span >${admin.username}</span>
            </div>
            <div class="col-md-12">
              <div class="form-check form-switch index=${admin.id}">
                <input name="Admin${admin.id}" class="form-check-input member-btn" type="checkbox" role="switch"
                  id="flexSwitchCheckChecked" value="true" index=${admin.id}>
                <label class="form-check-label" for="flexSwitchCheckChecked" index=${admin.id}>On to Admin</label >
              </div>
            </div>
          </div>`;
    } else {
      adminResultContainer.innerHTML += `
            <div class="col-md-12 userAllDivs">
                <div>
                <span class="user-name">Username: </span><span>${admin.username}</span>
                </div>
                <div class="col-md-12">
                  <div class="form-check form-switch" index=${admin.id}>
                    <input name="Member${admin.id}" class="form-check-input member-btn" type="checkbox" role="switch"
                      id="flexSwitchCheckChecked" value="true"  checked=true index=${admin.id}>
                    <label class="form-check-label" for="flexSwitchCheckChecked" index=${admin.id}>Off to User</label>
                  </div>
                </div>
              </div>`;
    }
  }
  //改 admin
  const userAllDivs = document.querySelectorAll(".userAllDivs");
  for (let userDivs of userAllDivs) {
    const memberbtn = await userDivs.querySelector(".member-btn");

    memberbtn.addEventListener("click", async (event) => {
      const editIndex = event.currentTarget.getAttribute("index");
      console.log(editIndex);
      console.log(event.currentTarget.checked);
      const isAdmin = event.currentTarget.checked ? true : false;
      console.log(isAdmin);

      // Call Edit API
      const userEditRes = await fetch("/user/update", {
        method: "PUT",
        body: JSON.stringify({
          isAdmin: isAdmin,
          index: editIndex,
        }), //記得JSON出寫返headers
        headers: { "Content-Type": "application/json" },
      });
      if (userEditRes.ok) {
        loadAdmin();
      }
    });
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
      window.location.href = "/";
    }, 2000);
  }
}

async function loginPage() {
  window.location.href = "/user/login.html";
}
