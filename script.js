const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes'); // Assuming you have a routes.js file

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://zoaibsihorwala:zoaibsihorwala@tabletennistracker.0ykcaxf.mongodb.net/")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Use routes
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





