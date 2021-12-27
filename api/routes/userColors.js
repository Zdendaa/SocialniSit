const router = require('express').Router();
const UserColors = require('../models/UserColors');

// vytvoreni noveho zaznamu v UserColors
router.post('/createUserColors', async (req, res) => {
    try {
        const userColors = new UserColors({
            idOfUser: req.body.idOfUser,
            backgroundColor1: req.body.backgroundColor1,
            backgroundColor2: req.body.backgroundColor2,
            backgroundColor3: req.body.backgroundColor3,
            backgroundColor4: req.body.backgroundColor4
        });
        const newUserColors = await userColors.save();
        res.status(200).send(newUserColors);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.put('/updateUserColors', async (req, res) => {
    try {
        const currentUserColors = await UserColors.findOne({idOfUser: req.body.idOfUser});
        const updatedUserColors = await currentUserColors.updateOne({ $set: {
                backgroundColor1: req.body.backgroundColor1, 
                backgroundColor2: req.body.backgroundColor2, 
                backgroundColor3: req.body.backgroundColor3, 
                backgroundColor4: req.body.backgroundColor4
            }
        })
        res.status(200).send(updatedUserColors);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get('/ifUserColorsExist/:id', async (req, res) => {
    try {
        const currentUserColors = await UserColors.findOne({idOfUser: req.params.id});
        res.status(200).send(currentUserColors);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.delete('/deleteUserColors/:id', async (req, res) => {
    try {
        const currentUserColors = await UserColors.findOne({idOfUser: req.params.id});
        await currentUserColors.deleteOne();
        res.status(200).send("záznam byl úspěšně smazán");
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;
