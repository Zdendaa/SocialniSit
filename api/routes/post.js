const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

/** PRIDAVANI POSTU */
router.post("/addPost", async (req, res) => {
    try {
        // vytvoreni noveho postu
        const post = new Post({
            userId: req.body.userId,
            desc: req.body.desc,
            urlOfImg: req.body.urlOfImg,
            idOfImg: req.body.idOfImg
        })
        // ulozeni postu do db
        const newPost = await post.save();

        // jesli se nenaskytla zadna chyba posleme data noveho postu
        res.status(200).json(newPost); 
    } catch (err) {
        res.status(500).json(err);
    }
})

/* DOSTANI VSECH TVYCH POSTU A VSECH OD TVOJICH PRATEL (TIMELINE)*/
router.get("/getAllPosts/:userId", async (req, res) => {
    try {
        // vyhledani naseho uzivatele pomoci userId 
        const currentUser = await User.findById(req.params.userId);
        // vyhledani vsech postu naseho uzivatele pomoci userId
        const userPosts = await Post.find({userId: req.params.userId});

        // vyhledani vsech postu nasich kamaradu
        const allFriendsPosts = await Promise.all(
            currentUser.idOfFriends.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );
        // spojeni vsech postu od naseho uzivatele a vsech postu nasich pratel
        const timeLinePosts = userPosts.concat(...allFriendsPosts);

        // jesli se nenaskytla zadna chyba posleme data noveho postu
        res.status(200).json(timeLinePosts); 
    } catch (err) {
        res.status(500).json(err);
    }
})

/* PRIDANI NEBO ODEBRANI LIKEU*/
router.put("/addOrRemoveLike/:id", async (req, res) => {
    try {
        // najdeme post u ktereho chceme znenit likey
        const post = await Post.findById(req.params.id);
        // pokud jsme tento post jeste nelikely tak pridame like
        if(!post.idOfLikes.includes(req.body.userId)) {
            await post.updateOne({ $push: { idOfLikes: req.body.userId }});
            res.status(200).send("k prispevku byl pridan like");
        } else {
        // pokud jsme tento post uz likely tak like odebereme
            await post.updateOne({ $pull: { idOfLikes: req.body.userId }});
            res.status(200).send("like byl odebran z prispevku");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

/* DOSTANI VSECH POSTU OD JEDNOHO UZIVATELE*/
router.get("/getPosts/:userId", async (req, res) => {
    try {
        // dostat vsechny vase posty
        const allPosts = await Post.find({userId: req.params.userId});

        // jesli se nenaskytla zadna chyba posleme data noveho postu
        res.status(200).json(allPosts); 
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;