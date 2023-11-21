const mongoose = require("mongoose")
const User = require("./User")

mongoose.connect("mongodb+srv://zoaibsihorwala:zoaibsihorwala@tabletennistracker.0ykcaxf.mongodb.net/")

run()
async function run() {
    const user1 = await User.create({
        username:"kyle", 
        password: "ninfds",
        elo: 1000
    })
    user1.username = "Billy"
    user1.createdAt = 12
    await user1.save()
    console.log(user1);
}






// document.getElementById("loginForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Prevent the default form submission
  
//     // Get the value from the input field
//     let username = document.getElementById("username").value;
//     let password = document.getElementById("password").value;

//     if(password.length <= 8){
//         //do a pop-up
//         document.getElementById("username").value = "";
//     }

//     //if(username)
  
    
//   });