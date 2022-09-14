window.onload = initSignupPage;

function initSignupPage() {

    let signupFormElem = document.querySelector('#signup-form')
    let signupResultElem = document.querySelector('#signup-result')

    if (signupFormElem) {
        signupFormElem.addEventListener('submit', async (e) => {

            console.log('signup form is submitting now');

            // 1.preparation for
            e.preventDefault();
            let signupFormObj = {
                username: signupFormElem.username.value,
                password: signupFormElem.password.value,
            }
            console.log(signupFormObj)

            // 2.fetch
            let res = await fetch('/user/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(signupFormObj),
            })

            let result = await res.json()
            console.log(result)



            //after fetch handling
            if (res.ok) {
                // success handling
                signupResultElem.innerText = "success"
            } else {
                // error handling
                signupResultElem.innerText = "error"  // <--- Not OK yet --->

            }
        })
    }
    console.log('signup page is loaded');

}
