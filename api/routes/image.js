const router = require('express').Router();
const Image = require('../models/Image');

// vytvoreni img
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

// pridani url do image
router.put("/addUrl/:id", async (req, res) => {
    try {
        // vyhledani img podle img._id
        const currentImg = await Image.findByIdAndUpdate(req.params.id, {urlOfImg: req.body.url})

        res.status(200).send(currentImg)
    } catch (err) {
        res.status(500).send(err)
    }
})

// dostani dat obrazku
router.get("/getImg", async (req, res) => {
    try {
        const image = await Image.findById(req.body.id);
        res.status(200).send(image);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;