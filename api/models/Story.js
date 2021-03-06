const mongoose = require('mongoose');

const stories = new mongoose.Schema({
    idOfUser: {
        type: String,
        require: true
    },
    urlOfImg: {
        type: String,
        require: true
    },
    urlOfVideo: {
        type: String,
        require: true
    },
    text: {
        type: String,
    },
    position: {
        type: String,
    },
    expire_at: { type: Date, default: Date.now, expires: 86400 } // za expires dosazujeme sekundy, toto nasatvi auto delete za nejakou dobu
},
    { timestamps: true } // kazdy zaznam stories bude mit svuj cas kdy byl zverejnen
)

module.exports = mongoose.model("Story", stories);