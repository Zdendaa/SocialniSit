const router = require('express').Router();
const Post = require('../models/Post');

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

/* DOSTANI VSECH POSTU*/
router.get("/getAllPosts", async (req, res) => {
    try {
        
        const allPosts = await Post.find();

        // jesli se nenaskytla zadna chyba posleme data noveho postu
        res.status(200).json(allPosts); 
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


module.exports = router;