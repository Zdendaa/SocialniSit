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
    idOfLikes: {
        type: Array,
        default: []
    },
    idOfComment: {
        type: Array,
        default: null
    },
    newPicture: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true } // kazdy post bude mit datum vytvoreni
);

module.exports = mongoose.model("Post", post);