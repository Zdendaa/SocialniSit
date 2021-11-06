const mongoose = require('mongoose');

const comment = new mongoose.Schema({
    value: {
        type: String,
        required: true,
    },
    urlOfImg: {
        type: String,
    },
    idOfLikes: {
        type: Array,
        default: []
    },
    idOfUser: {
        type: String,
        required: true,
    },
    idOfparentComment: {
        type: String,
        default: null
    },
    idOfPost: {
        type: String,
        default: null,
        required: true
    }

},
{ timestamps: true } // kazdy uzivatel bude mit datum vytvoreni uctu
);

module.exports = mongoose.model("Comment", comment);