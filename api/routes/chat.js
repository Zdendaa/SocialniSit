const router = require('express').Router();
const Chat = require('../models/Chat');


router.post("/createChat", async (req, res) => {
    try {
        // vytvoreni noveho cahtu
        const chat = new Chat({
            usersId: req.body.usersId
        })
        // ulozeni postu do db
        const newChat = await chat.save();

        // jesli se nenaskytla zadna chyba posleme data noveho chatu
        res.status(200).json(newChat);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/getAllChats/:id", async (req, res) => {
    try {
        // vyhledani vsech chatu ve kterych jsme
        const chats = await Chat.find({
            usersId: {
                $in: req.params.id
            }
        });
        res.status(200).send(chats);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;