const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    elo: {
        type: Number,
        min: 0,
        default: 100
    },
    bestOpponent: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    winPercent: Number,
    matchHistory: [{
        opponent: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User"
        },
        score: {
            userPoints: {
                type: Number,
                default: 0
            },
            opponentPoints: {
                type: Number,
                default: 0
            },
            matchWon: {
                type: Boolean,
                default: null
            }
        },
        datePlayed: {
            type: Date,
            default: Date.now()
        }
        // Other properties related to the game if needed
    }]
})


userSchema.methods.sayHi = function() {
    console.log(`Hi. My name is ${this.username}`)
}

userSchema.statics.findByName = function(username) {
    return this.find({username: new RegExp(username, "i")})
}

// userSchema.query.byName = function(name) {

// }



module.exports = mongoose.model("User", userSchema)

