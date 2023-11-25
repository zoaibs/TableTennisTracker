var popup = document.getElementById("myPopup");


document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Get the value from the input field
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
 
    // if(password.length < 8){
    //     popup.textContent = "Password is too short!"
    //     popup.classList.add("show");
    //     console.log("tooshort")
    //     //document.getElementById("username").value = "";
    // } else {
        //popup.classList.remove("show")
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
        if(data.message === "Username already taken" && password.length < 8){
            //popup.classList.add("hide")
            popup.textContent = "Username already taken, please try again!"
            popup.classList.add("show");

        } else if(data.message === "Password is too short!"){
            console.log("attempting po[uo[")
            //popup.classList.add("hide")
            popup.textContent = "Password must be at least 8 characters!"
            popup.classList.add("show");
        } else {
            //login/account creation was a success!
            popup.classList.add("hide");
        }
        // Handle response
    } catch (error) {
        console.error("There was a deadly error oh noooo!");
    }
    
});