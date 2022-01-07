const router = require('express').Router();
const Notification = require('../models/Notification');

router.post("/addNotification", async (req, res) => {
    try {
        const notification = new Notification({
            senderId: req.body.senderId,
            recieverId: req.body.recieverId,
            type: req.body.type,
            url: req.body.url,
            idOfPost: req.body.idOfPost,
            text: req.body.text
        })
        const newNotification = await notification.save();
        res.status(200).json(newNotification);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get("/getAllNotifications/:id", async (req, res) => {
    try {
        const allNotifications = await Notification.find({recieverId: req.params.id});
        res.status(200).json(allNotifications);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.put("/changeReadedToTrue", async (req, res) => {
    try {
        const currentNotification = await Notification.findById(req.body.id);
        await currentNotification.updateOne({ $set: {readed: true}});

        res.status(200).send("Notifikace znemena na prectenou");
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;