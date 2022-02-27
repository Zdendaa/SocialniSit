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
        const allFriends = await Promise.all(user.idOfFriends.map(async (friend) => {
            const story = await Story.find({ idOfUser: friend });
            return story.length === 0 ? null : story;
        })
        );
        // predelani nekolika polich objektu do jednoho pole objektu
        const singleArrayallFriends = allFriends.filter(x => x).reduce((prevValue, currentValue) => {
            currentValue.forEach(item => prevValue.push(item))
            return prevValue;
        }, []);

        res.status(200).json(singleArrayallFriends); // fitler vyfiltruje hodnoty null
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
