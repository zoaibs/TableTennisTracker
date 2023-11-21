const mongoose = require("mongoose")
const User = require("./User")

mongoose.connect("mongodb+srv://zoaibsihorwala:zoaibsihorwala@tabletennistracker.0ykcaxf.mongodb.net/")

run()
async function run() {
    const user = await User.findByName("kyle")
    // user.bestOpponent = '655cf8e02594390bd0c403f9'
    // await user.save()
    //user.sayHi()
    console.log(user)
    // const user1 = await User.create({
    //     username:"kyle", 
    //     password: "ninfds",
    //     elo: 1000
    // })
    // user1.username = "Billy"
    // user1.createdAt = 12
    // await user1.save()
    // console.log(user1);
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
        //20:16
    
//   });


// currentUser.matchHistory.push({
//     opponent: opponentId,
//     score: {
//         userPoints: userPointsScored,
//         opponentPoints: opponentPointsScored
//     },
//     datePlayed: new Date()
// });

// // Save the user object after updating matchHistory
// await currentUser.save();