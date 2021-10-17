const mongoose = require('mongoose');

// schema postu
const post = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        default: null
    },
    urlOfImg: {
        type: String,
        default: null
    },
    idOfImg: {
        type: String,
        default: null
    },
    idOfComment: {
        type: Array,
        default: null
    }
},
{ timestamps: true } // kazdy post bude mit datum vytvoreni
);

module.exports = mongoose.model("Post", post);