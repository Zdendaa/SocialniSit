const router = require('express').Router();
const Image = require('../models/Image');

// vytvoreni img
router.post("/createNew", async (req, res) => {
    try {
        // vytvoreni obrazku
        const newImage = new Image({
            url: req.body.url,
            idOfPost: req.body.idOfPost
        })

        // ulozeni noveho obrazku do databaze
        const image = await newImage.save();

        res.status(200).json(image);
    } catch (err) {
        res.status(500).json(err);
    }
})

// pridani url do image
router.put("/addUrl/:id", async (req, res) => {
    try {
        // vyhledani img podle img._id
        const currentImg = await Image.findByIdAndUpdate(req.params.id, {urlOfImg: req.body.url})

        res.status(200).json(currentImg)
    } catch (err) {
        res.status(500).json(err)
    }
})

// dostani dat obrazku
router.get("/getImg/:id", async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        res.status(200).json(image);
    } catch (err) {
        res.status(500).json(err);
    }
})

// vyhledani obrazku pomoci url adresy
router.post("/getImgByUrl", async (req, res) => {
    try {
        const image = await Image.findOne({url: req.body.url});

        res.status(200).json(image);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;