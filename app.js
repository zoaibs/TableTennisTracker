const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes'); // Assuming you have a routes.js file
const bcrypt = require('bcrypt')


const app = express();
//hi
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://rohma01:footballmadness@tabletennistracker.0ykcaxf.mongodb.net/")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Use routes
app.use(userRoutes);

const PORT = process.env.PORT || 3000; //
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});




//asdasdasd




