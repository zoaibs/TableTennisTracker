const express = require('express');
const User = require('./User'); // Your Mongoose User model
const bcrypt = require('bcrypt')
const router = express.Router();

router.post('/register', async (req, res) => {
    try { 
        const { username, password } = req.body;

        // Check if a user with the same username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            // Check if the inputted password differs from the existing user's password
            const passwordMatch = await existingUser.comparePassword(password);

            if (!passwordMatch) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            // Password matches, so allow registration with the same username
        }

        // If no existing user or password matches, create a new user
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

module.exports = router
