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
    from: {
        type: String,
        max: 50
    },
    relationShip: {
        type: String
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("UserInfo", userInfo);