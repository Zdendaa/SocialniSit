const mongoose = require('mongoose');

const userInfo = new mongoose.Schema({
    idOfUser: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    ralationship: {
        type: Number,
        enum: [1,2,3]
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("UserInfo", userInfo);