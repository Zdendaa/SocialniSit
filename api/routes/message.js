const router = require('express').Router();
const Message = require('../models/Message');


router.post("/addMessage", async (req, res) => {
    try {
        // vytvoreni nove zpravy
        const message = new Message({
            idOfSender: req.body.idOfSender,
            idOfReciever: req.body.idOfReciever,
            idOfChat: req.body.idOfChat,
            text: req.body.text
        })
        // ulozeni postu do db
        const newMessage = await message.save();

        // jesli se nenaskytla zadna chyba posleme data nove zpravy
        res.status(200).json(newMessage);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/getAllMessages/:idOfChat", async (req, res) => {
    try {
        // vyhledani vsech zprav z daneho chatu
        const messages = await Message.find({ idOfChat: req.params.idOfChat });

        res.status(200).send(messages);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.put("/setReadedAllMessage", async (req, res) => {
    try {
        // vyhledani vsech zprav z daneho chatu
        console.log("neconeoc")
        const messages = await Message.find({ idOfChat: req.body.idOfChat, idOfSender: req.body.idOfSender, readed: false });
        console.log(req.body.idOfChat);
        console.log(messages);
        messages.map(async (message) => {
            await message.updateOne({ readed: true });
        })
        res.status(200).send(messages);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;