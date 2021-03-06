const mongoose = require('mongoose');

// schema chatu
const chat = new mongoose.Schema({
    usersId: {
        type: Array
    },
    lastMessage: {
        type: String
    },
    lastMessageTime: {
        type: Date
    },
    readed: {
        type: Boolean,
        default: false
    },
    lastIdOfUser: {
        type: String
    }
})

module.exports = mongoose.model("Chat", chat);