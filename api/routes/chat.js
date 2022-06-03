const router = require('express').Router();
const Chat = require('../models/Chat');


router.post("/createChat", async (req, res) => {
    try {
        // vytvoreni noveho cahtu
        const chat = new Chat({
            usersId: req.body.usersId,
            lastMessage: req.body.lastMessage,
            lastMessageTime: req.body.lastMessageTime,
            lastIdOfUser: req.body.lastIdOfUser
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

router.put("/setLastMessage", async (req, res) => {
    try {
        // console.log(req.body.lastMessageTime)
        const updatedChat = await Chat.findByIdAndUpdate(req.body.id, { lastMessage: req.body.lastMessage, lastMessageTime: req.body.lastMessageTime, readed: req.body.readed, lastIdOfUser: req.body.lastIdOfUser });
        res.status(200).send(updatedChat);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.put("/updateReaded", async (req, res) => {
    try {
        const updatedChat = await Chat.findByIdAndUpdate(req.body.id, { readed: req.body.readed });
        res.status(200).send(updatedChat);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;