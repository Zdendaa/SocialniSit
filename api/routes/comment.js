const router = require('express').Router();
const Comment = require('../models/Comment')

/**DOSTANI VSECH KOMENTARU K DANEMU PRISPEVKU */
router.get("/getComments/:id", async (req, res) => {
    try {
        const comments = await Comment.find({idOfPost: req.params.id});
        res.status(200).send(comments);
    } catch (err) {
        res.status(500).send(err);
    }
})

/**PRIDANI KOMENTARE */
router.post("/addComment", async (req, res) => {
    try {
        const comment = new Comment({
            value: req.body.value,
            urlOfImg: req.body.urlOfImg,
            idOfMainComment: req.body.idOfMainComment,
            idOfPost: req.body.idOfPost
        })
        const newComment = await comment.save();
        res.status(200).send(newComment);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;