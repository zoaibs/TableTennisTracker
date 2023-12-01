const express = require('express');
const User = require('./User');
const bcrypt = require('bcrypt')
const router = express.Router();

router.post('/register', async (req, res) => {
    try { 
        const { username, password } = req.body;

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
                return res.status(201).json({ message: 'Welcome back existing user!' });
            }
            // Password matches, so allow registration with the same username
        } else {
            //create a new user since the given username does not exist
            console.log("created new user!")

            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            console.log(hashedPassword)
            const newUser = new User({ username: username, password: hashedPassword });
            await newUser.save();
            res.status(201).json({ message: 'User created successfully' });
        }

        // If no existing user or password matches, create a new user 
        
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
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






module.exports = router
 