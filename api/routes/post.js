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

module.exports = router;