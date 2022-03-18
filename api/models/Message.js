const mongoose = require('mongoose');

// schema zpravy
const message = new mongoose.Schema({
    idOfSender: {
        type: String,
        required: true
    },
    idOfReciever: {
        type: String,
        required: true
    },
    idOfChat: {
        type: String,
        required: true
    },
    text: {
        type: String,
    },
    urlOfImg: {
        type: String,
    },
    urlOfVideo: {
        type: String,
    },
    urlOfVoice: {
        type: String,
    },
    type: {
        type: Number // 0 - posilani, 1 - poslano, 2 - precteno
    }
},
    { timestamps: true } // kazda zprava bude mit datum vytvoreni
)

module.exports = mongoose.model("Message", message);