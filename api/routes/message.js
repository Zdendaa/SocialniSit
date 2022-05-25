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
            text: req.body.text,
            urlOfVoice: req.body.urlOfVoice,
            urlOfImg: req.body.urlOfImg,
            urlOfVideo: req.body.urlOfVideo
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

/* PRIDANI NEBO ODEBRANI LIKEU*/
router.put("/addOrRemoveLike/:id", async (req, res) => {
    try {
        // najdeme post u ktereho chceme znenit likey
        const message = await Message.findById(req.params.id);
        // // pokud jsme tento post jeste nelikely tak pridame like
        if (!message.idOfLikes.includes(req.body.userId)) {
            await message.updateOne({ $push: { idOfLikes: req.body.userId } });
            res.status(200).send("k prispevku byl pridan like");
        }
        else {
            // pokud jsme tento post uz likely tak like odebereme
            await message.updateOne({ $pull: { idOfLikes: req.body.userId } });
            res.status(200).send("like byl odebran z prispevku");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;