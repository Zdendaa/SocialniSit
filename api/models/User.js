const mongoose = require('mongoose');

// schema uzivatele
const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 2
    },
    idOfProfilePicture: {
        type: String,
        default: null
    },
    idOfCoverPicture: {
        type: String,
        default: null
    },
    idOfAllPicture: {
        type: Array,
        default: null
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    ralationship: {
        type: Number,
        enum: [1,2,3]
    }
},
{ timestamps: true } // kazdy uzivatel bude mit datum vytvoreni uctu
);

module.exports = mongoose.model("User", user);