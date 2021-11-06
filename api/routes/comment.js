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
            idOfparentComment: req.body.idOfparentComment,
            idOfPost: req.body.idOfPost,
            idOfUser: req.body.idOfUser
        })
        console.log(comment);
        const newComment = await comment.save();
        res.status(200).send(newComment);
    } catch (err) {
        res.status(500).json(err);
    }
})

/**PRIDANI LIKEU KE KOMENTARI */
router.put("/addOrRemoveLike/:idOfComment/:idOfUser", async (req, res) => {
  try {
      const currentComment = await Comment.findById(req.params.idOfComment);
      
      if (currentComment.idOfLikes.includes(req.params.idOfUser)) {     
            await currentComment.updateOne({$pull: {idOfLikes: req.params.idOfUser}});
      } else {
            await currentComment.updateOne({$push: {idOfLikes: req.params.idOfUser}});
      }
      res.status(200).json("like byl pridan ke komentari");
  } catch (err) {
      res.status(500).send(err);
  }
})


module.exports = router;