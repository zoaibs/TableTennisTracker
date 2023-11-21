const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    elo: Number,
    bestOpponent: mongoose.SchemaTypes.ObjectId,
    winPercent: Number
})

module.exports = mongoose.model("User", userSchema)

