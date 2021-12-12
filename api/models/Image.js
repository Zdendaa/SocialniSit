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
},
{ timestamps: true } // kazdy post bude mit datum vytvoreni
)

module.exports = mongoose.model("Image", image);