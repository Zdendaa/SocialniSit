const express = require('express');
const connect = require('./database/connect');
const dotenv = require('dotenv') // diky dotenv muzu nacitat promenne v souboru .env
var cors = require('cors')

// volani routu
const user = require('./routes/user');
const image = require('./routes/image');
const post = require('./routes/post');
const comment = require('./routes/comment');
const sharedPost = require('./routes/sharedPost');
const userInfo = require('./routes/userInfo');
const userColors = require('./routes/userColors');
const notification = require('./routes/notification');
const story = require('./routes/story');
const chat = require('./routes/chat');
const message = require('./routes/message');
const path = require('path');

dotenv.config();
const app = express();

// pripojeni k mongoDb 
connect();

// port
const PORT = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());

// nastaveni url adresy rout, abychom k nim mohli pristupovat
app.use("/api/users", user);
app.use("/api/images", image);
app.use("/api/posts", post);
app.use("/api/comments", comment);
app.use("/api/sharedPosts", sharedPost);
app.use("/api/userInfos", userInfo);
app.use("/api/userColors", userColors);
app.use("/api/notifications", notification);
app.use("/api/stories", story);
app.use("/api/chats", chat);
app.use("/api/messages", message);


// jestli je appka na hostingu, nebo jestli na localhostu
const __dirname1 = path.resolve(); // current path
if (process.env.NODE_ENV = "production") {
    app.use(express.static(path.join(__dirname1, "../client/build")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'client', 'build', 'index.html'));
    });
} else {
    app.get("/", (req, res) => { res.send("API is running successfully") })
}


// zpusteni serveru
const server = app.listen(PORT, () => {
    console.log(`server bezi na portu ${PORT}`);
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
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