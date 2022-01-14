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
    },
    idOfPost: {
        type: String,
    }
},
{ timestamps: true } // kazdy post bude mit datum vytvoreni
)

module.exports = mongoose.model("Image", image);