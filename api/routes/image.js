const router = require('express').Router();
const Image = require('../models/Image');

router.post("/createNew", async (req, res) => {
    try {
        // vytvoreni obrazku
        const newImage = new Image({
            name: req.body.name
        })

        // ulozeni noveho obrazku do databaze
        const image = await newImage.save();

        res.status(200).send(image);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;