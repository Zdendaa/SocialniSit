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

    socket.on("sendNotification", ({senderId, recieverId, type, url, idOfPost, readed, text}) => {
        console.log("notification sended", recieverId);
        findUser(recieverId)?.socketId && io.to(findUser(recieverId).socketId).emit("getNotification", {senderId, recieverId, type, url, idOfPost, readed, text});
    })

    socket.on("disconnect", () => {
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
});