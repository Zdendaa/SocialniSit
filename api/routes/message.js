const router = require('express').Router();
const Message = require('../models/Message');
const Chat = require('../models/Chat');

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

router.post("/getNumberOfUnreadedMessages", async (req, res) => {
    try {
        const newMessages = await Message.find({ readed: false, idOfChat: req.body.idOfChat, idOfReciever: req.body.myId });
        res.status(200).send(newMessages);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.post("/getNumberOfUnreadedMessagesInMessenger", async (req, res) => {
    try {
        // vyhledani vsech chatu ve kterych jsme
        const chats = await Chat.find({
            usersId: {
                $in: req.body.myId
            }
        });
        // projeti vsech chatu a vyhledani pomoci jejich id vsechny neprectene zpravy a vraceni jejich poctu
        const numbersOfNewMessages = await Promise.all(chats.map(async (chat) => {
            const newMessages = await Message.find({ readed: false, idOfChat: chat._id, idOfReciever: req.body.myId });
            return newMessages.length;
        }))
        // secteni vsech hodnot v poli
        const sum = numbersOfNewMessages.reduce((partialSum, a) => partialSum + a, 0);
        res.status(200).send(sum + "");

    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;