const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes'); // Assuming you have a routes.js file
const bcrypt = require('bcrypt')
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('./User.js')
let users = [];

const app = express();
//hi
app.use(express.json());

app.use(session({
    secret: 'your-secret-key', // Change this to a random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
// Connect to MongoDB
mongoose.connect("mongodb+srv://zoaibsihorwala:zoaibsihorwala@tabletennistracker.0ykcaxf.mongodb.net/")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Use routes

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/register'); // Redirect to the login page if not authenticated
    }
};

app.get('/profile', isAuthenticated, (req, res) => {
    // Render the profile page with user data
    const user = req.session.user;

    res.render('profile', { user });
});
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




