var popup = document.getElementById("myPopup");


document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission
    let username = '';
    let password = '';

    // Get the value from the input field
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
 
    if(password.length < 8){
        popup.textContent = "Password is too short!"
        popup.classList.add("show");
        console.log("tooshort")
        //document.getElementById("username").value = "";
    } else {
    popup.classList.remove("show")

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.redirected) {
            window.location.href = response.url;
        }
        else {
            // Handle other responses
            // const data = await response.json();
            //return response.json();
        
        // Check if the data contains a redirect property
        if (data && data.redirect) {
            const redirectUrl = data.redirect;
            console.log(redirectUrl)
            // Handle the redirect manually
            //localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = `${redirectUrl}`;
        } else if(data && data.message == "Username already taken")
        {
            popup.textContent = "Username already taken, please try again!"
            popup.classList.add("show");
        }
        else {
            //login/account creation was a success!
            popup.classList.add("hide");
        }
    }

        //const data = await response.json();
        console.log("Uh oh!")
        console.log(data.message);
        if(data.message === "Username already taken" && password.length < 8){
            //popup.classList.add("hide")
            popup.textContent = "Username already taken, please try again!"
            popup.classList.add("show");

        } else if(data.message === "Password is too short!"){
            console.log("attempting popup")
            //popup.classList.add("hide")
            popup.textContent = "Password must be at least 8 characters!"
            popup.classList.add("show");
        } else {
            //login/account creation was a success!
            popup.classList.add("hide");
        }
        // Handle response
    } catch (error) {
        console.log(error)
        console.error("There was a deadly error oh noooo!");
    }
}
});
