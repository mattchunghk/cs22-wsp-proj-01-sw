
loadAdmin()

const socket = io.connect();
socket.on("new-user-update", (data) => {
    console.log(data);
    loadAdmin()
})


//拎 admin
async function loadAdmin() {
    const adminResult = await fetch('/user/admin');
    const adminResultJson = await adminResult.json();
    console.log(adminResultJson);
    const adminResultContainer = document.querySelector('#admin_container');
    adminResultContainer.innerHTML = "";

    const userResultContainer = document.querySelector('#user_container');
    userResultContainer.innerHTML = "";


    for (let admin of adminResultJson) {
        console.log(admin.id);
        if (!admin.is_admin) {
            userResultContainer.innerHTML += `
            <div class="col-md-5 userAllDivs">
            <div>
              Name: <span>${admin.username}</span>
            </div>
            <div class="col-md-5">
              <div class="form-check form-switch index=${admin.id}">
                <input name="Admin${admin.id}" class="form-check-input member-btn" type="checkbox" role="switch"
                  id="flexSwitchCheckChecked" value="true" index=${admin.id}>
                <label class="form-check-label" for="flexSwitchCheckChecked" index=${admin.id}>Admin</label >
              </div>
            </div>
          </div>`
        } else {

            adminResultContainer.innerHTML += `
            <div class="col-md-5 userAllDivs">
                <div>
                  Name: <span>${admin.username}</span>
                </div>
                <div class="col-md-5">
                  <div class="form-check form-switch" index=${admin.id}>
                    <input name="Member${admin.id}" class="form-check-input member-btn" type="checkbox" role="switch"
                      id="flexSwitchCheckChecked" value="true"  checked=true index=${admin.id}>
                    <label class="form-check-label" for="flexSwitchCheckChecked" index=${admin.id}>Admin</label>
                  </div>
                </div>
              </div>`
        }
    }
    //改 admin
    const userAllDivs = document.querySelectorAll('.userAllDivs')
    for (let userDivs of userAllDivs) {

        const memberbtn = await userDivs.querySelector('.member-btn')

        memberbtn.addEventListener('click', async (event) => {
            const editIndex = event.currentTarget.getAttribute('index')
            console.log(editIndex);
            console.log(event.currentTarget.checked);
            const isAdmin = event.currentTarget.checked ? true : false;
            console.log(isAdmin);

            // Call Edit API
            const userEditRes = await fetch('/user/update', {
                method: 'PUT',
                body: JSON.stringify({
                    "isAdmin": isAdmin,
                    "index": editIndex
                }),//記得JSON出寫返headers
                headers: { 'Content-Type': 'application/json' },

            })
            if (userEditRes.ok) {
                loadAdmin()
            }

        })







    }

}


