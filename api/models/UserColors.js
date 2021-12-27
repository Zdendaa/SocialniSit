const mongoose = require('mongoose');

const userColors = new mongoose.Schema({
    idOfUser: {
        type: String,
        required: true
    },
    backgroundColor1: {
        type: String,
    },
    backgroundColor2: {
        type: String,
    },
    backgroundColor3: {
        type: String,
    },
    backgroundColor4: {
        type: String,
    }
});

module.exports = mongoose.model("UserColors", userColors);