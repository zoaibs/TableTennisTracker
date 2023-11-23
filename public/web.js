var popup = document.getElementById("myPopup");


document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Get the value from the input field
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
 
    console.log("got a sbt")

    if(password.length < 8){
        popup.textContent = "Password is too short!"
        popup.classList.add("show");
        console.log("tooshort")
        document.getElementById("username").value = "";
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
            console.log("Uh oh!")
            console.log(data.message);
            if(data.message = "Username already taken" && !password.length < 8)
            {
                popup.textContent = "Username already taken, please try again!"
                popup.classList.add("show");
            } else {
                popup.classList.add("hide");
            }
            // Handle response
        } catch (error) {
            console.error('Error:', error);
        }
    }

});