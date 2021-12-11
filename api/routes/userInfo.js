const router = require('express').Router();
const UserInfo = require('../models/UserInfo');

router.get("/getUserInfo/:id", async (req, res) => {
    try {
        const userInfo = await UserInfo.findOne({idOfUser: req.params.id});

        res.status(200).send(userInfo);
    } catch (err) {
        res.status(500).json(err);
    }
})



module.exports = router;