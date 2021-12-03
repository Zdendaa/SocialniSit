const mongoose = require('mongoose');

const sharedPost = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    idOfSharingToUser: {
        type: String,
        default: null
    },
    desc: {
        type: String,
        default: null
    },
    idOfMainPost: {
        type: String,
        required: true
    }
},
{ timestamps: true } // kazdy post bude mit datum vytvoreni
);

module.exports = mongoose.model("SharedPost", sharedPost);