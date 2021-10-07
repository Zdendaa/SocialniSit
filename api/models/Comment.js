const mongoose = require('mongoose');

const comment = new mongoose.Schema({
    value: {
        type: String,
        required: true,
    },
    nameOfPicture: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },
    idOfMainComment: {
        type: String,
        default: null
    }
},
{ timestamps: true } // kazdy uzivatel bude mit datum vytvoreni uctu
);

module.exports = mongoose.model("Comment", comment);