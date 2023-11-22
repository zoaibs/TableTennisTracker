var popup = document.getElementById("myPopup");


document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Get the value from the input field
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
 
    console.log("got a sbt")

    if(password.length < 8){
        popup.classList.add("show");
        console.log("tooshort")
        document.getElementById("username").value = "";
    } else {
        popup.classList.remove("show")
    }
    // } else if() {

    // }
    //console.log()

    //if(username)
        //20:16
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log(data);
        // Handle response
    } catch (error) {
        console.error('Error:', error);
    }
});