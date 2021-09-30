const mongoose = require('mongoose');

// schema obrazku
const image = new mongoose.Schema({
    name: {
        type: String,
        required: true
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