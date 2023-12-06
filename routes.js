const express = require('express');
const User = require('./User');
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const router = express.Router();
let users = [];

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.post('/register', async (req, res) => {
    try { 
        const { username, password } = req.body;
        console.log(username)
        console.log(password)

        if(password.length < 8){
            console.log("Too short!")
            return res.status(200).json({ message: "Password is too short!" });
        }

        // Check if a user with the same username already exists
        const existingUser = await User.findOne({username: username});

        console.log("im here!")

        if (existingUser) {
            // Check if the inputted password differs from the existing user's password
            const passwordMatch = await existingUser.comparePassword(password);

            console.log(passwordMatch)
            //if passwords DONT match
            if (!passwordMatch) {
                console.log("taken already")
                return res.status(200).json({ message: 'Username already taken' });
            } else {
                //sign in the user if they do match!
                console.log("Welcome back!")
                console.log(users)
                users.push(existingUser);
                return res.status(201).json({redirect:'/home.html', user: existingUser});
            }
            // Password matches, so allow registration with the same username
        } else {
            //create a new user since the given username does not exist
            console.log("created new user!")

            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            console.log(hashedPassword)
            const newUser = new User({ username: username, password: hashedPassword });
            users.push(newUser);
            if (users.length == 1){
                newUser.admin=true;
            }
            console.log(users)
            await newUser.save();
            return res.status(201).json({redirect:'/home.html', user: existingUser});
        }

        // If no existing user or password matches, create a new user 
        
    } catch (error) {
        res.status(200).json({ message: 'Error creating user' });
    }
});

router.get('/getUserByUsername', (req, res) => {
    const { username } = req.query;
    
    const user = users.find(u => u.username === username);
    console.log(user)
    if (user) {
      res.json({user, users});
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
  router.post('/userGet', async (req, res) => {
    try{
    const user=req.body;

   // console.log(user._id)
    let newUser = await User.findByIdAndUpdate(user._id, user, {
        new: false
    });
    
    //console.log(newUser)
    await newUser.save();
        return res.status(201).json(newUser)
    } 
    catch{
        return res.status(400).json({message: "Error updating team"})
    }
});
router.post('/add-player', async (req, res) => {
    try { 
        const { username } = req.body;
        console.log("Username" + username)
        // Check if a user with the same username already exists
        const existingUser = await User.findOne({ username: username });
        console.log(existingUser)

        if (existingUser) {
            //if there is a user with that username
            console.log("added")
            return res.status(201).json({message: "User added!"})

        } else {
            //a user does not exist
            console.log("does not exist")
            return res.status(201).json({message: "A user with the specified username does not exist!"})
        }

        // If no existing user or password matches, create a new user 
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

router.post('/create-tournament', async (req, res) => {
    try { 
        const { username } = req.body;
        // Check if a user with the same username already exists
        const existingUser = await User.findOne({ username });

        console.log("im here!")     

        if (existingUser) {
            //if there is a user with that username
            if(existingUser.admin){
                return res.status(201).json({message: "Tournament created!"})
            } else {
                return res.status(201).json({message: "Only admins can create tournaments!"})
            }
        } else {
            //a user does not exist
            return res.status(201).json({message: "A user with the specified username does not exist!"})
        }
        // If no existing user or password matches, create a new user 
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

router.post('/submit-match', async (req, res) => {
    try {
        const { winner, loser, winnerScore, loserScore } = req.body;

        // Find the user by the winner's name
        const user = await User.findOne({ username: winner });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the winner's match history
        const match = {
            score: {
                userPoints: winnerScore,
                opponentPoints: loserScore,
                matchWon: true // Assuming the user who submits the score is always the winner
            },
            datePlayed: new Date() // Current date and time
            // Add any other relevant match information
        };

        user.matchHistory.push(match);
        await user.save();


        // Find the user by the winner's name
        const user2 = await User.findOne({ username: winner });

        if (!user2) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the loser's match history
        const match2 = {
            score: {
                userPoints: loserScore,
                opponentPoints: winnerScore,
                matchWon: false // Assuming the user who submits the score is always the winner
            },
            datePlayed: new Date() // Current date and time
            // Add any other relevant match information
        };

        user2.matchHistory.push(match2);
        await user2.save();

        res.status(200).json({ message: "Match history updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating match history" });
    }
});





module.exports = router
 