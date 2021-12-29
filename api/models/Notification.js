const mongoose = require('mongoose');

const notification = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    recieverId: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    url: {
        type: String,
    },
    idOfPost: {
        type: String,
    },
    readed: {
        type: Boolean,
        default: false
    },
    text: {
        type: String,
    }
},
{ timestamps: true } // kazdy post bude mit datum vytvoreni
)

module.exports = mongoose.model("Notification", notification);