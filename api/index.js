const express = require('express');
const connect = require('./database/connect');
const dotenv = require('dotenv') // diky dotenv muzu nacitat promenne v souboru .env

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
app.listen(PORT, () => {
    console.log(`server bezi na portu ${PORT}`);
})