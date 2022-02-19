const router = require('express').Router();
const Story = require('../models/Story');
const User = require('../models/User');

router.post("/addStory", async (req, res) => {
    try {
        const data = new Story({
            idOfUser: req.body.idOfUser,
            urlOfImg: req.body.urlOfImg,
            text: req.body.text,
            position: req.body.position
        })
        const newStory = await data.save();

        res.status(200).json(newStory);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/getAllStories/:idOfUser", async (req, res) => {
    try {
        const user = await User.findById(req.params.idOfUser);
        user.idOfFriends.push(req.params.idOfUser);
        const allFriends = await Promise.all(
            user.idOfFriends.map(async (friend) => {
                console.log(friend)
                const story = await Story.find({idOfUser: friend});
                return story.length === 0 ? null : story;
            })
        );

        res.status(200).json(allFriends.filter(x => x)); // fitler vyfiltruje hodnoty null
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
