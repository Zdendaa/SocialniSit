// vytvoreni socket.io serveru
const io = require('socket.io')(8900, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

// pole uzivatelu
let users = [];

const addUser = (userId, socketId) => {
    // pokud jiz neni tento uzivatel jiz v poli tak ho pridame
    !users.some(user => user.userId === userId) && users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    // odstraneni uzivatele z pole users
    users = users.filter((user) => user.socketId !== socketId);
}

const findUser = (userId) => {
    return users.find((user) => user.userId === userId);
}

// pripojeni serveru
io.on('connection', (socket) => {
    console.log('a user connected');
    // vezmi userId a socketId kazdeho prihlaseneho uzivatele
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    })

    socket.on("sendNotification", ({ id, senderId, recieverId, type, url, idOfPost, readed, text }) => {
        console.log("notification sended", recieverId);
        console.log(findUser(recieverId));
        findUser(recieverId) && io.to(findUser(recieverId).socketId).emit("getNotification", { id, senderId, recieverId, type, url, idOfPost, readed, text, date: Date.now() });
    })

    socket.on("sendMessage", ({ idOfMessage, idOfSender, idOfReciever, idOfChat, text, type, urlOfImg, urlOfVideo, urlOfVoice }) => {
        console.log("message sended", idOfReciever);
        console.log(findUser(idOfReciever));
        findUser(idOfReciever) && io.to(findUser(idOfReciever).socketId).emit("getMessage", { _id: idOfMessage, idOfSender, idOfReciever, idOfChat, text, readed: false, type, urlOfImg, urlOfVideo, urlOfVoice, createdAt: Date.now() });
    })

    socket.on("setReadedMessage", ({ idOfMessage, idOfUser, idOfChat }) => {
        // console.log("readed message set", idOfUser);
        // console.log(findUser(idOfUser));
        findUser(idOfUser) && io.to(findUser(idOfUser).socketId).emit("getReadedMessage", { _id: idOfMessage, idOfChat, idOfUser });
    })

    socket.on("disconnect", () => {
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
});