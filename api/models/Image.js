const mongoose = require('mongoose');

// schema obrazku
const image = new mongoose.Schema({
    url: {
        type: String,
        default: null
    },
    likes: {
        type: Array,
        default: []
    },
    idOfComments: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model("Image", image);