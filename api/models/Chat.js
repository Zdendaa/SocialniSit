const mongoose = require('mongoose');

// schema chatu
const chat = new mongoose.Schema({
    usersId: {
        type: Array
    },
    lastMessage: {
        type: String
    }
})

module.exports = mongoose.model("Chat", chat);