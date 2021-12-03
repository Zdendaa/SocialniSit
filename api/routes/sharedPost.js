const router = require('express').Router();
const SharedPost = require('../models/SharedPost');

/** PRIDAVANI SDÍLENÉHO POSTU */
router.post("/addSharedPost", async (req, res) => {
    try {
        // vytvoreni noveho postu
        const sharedPost = new SharedPost({
            userId: req.body.userId,
            idOfSharingToUser: req.body.idOfSharingToUser,
            desc: req.body.desc,
            idOfMainPost: req.body.idOfMainPost
        })
        // ulozeni postu do db
        const newPost = await sharedPost.save();

        // jesli se nenaskytla zadna chyba posleme data noveho postu
        res.status(200).json(newPost); 
    } catch (err) {
        res.status(500).json(err);
    }
})

/** SMAZANI SDÍLENÉHO POSTU */
router.post("/removeSharedPost", async (req, res) => {
    try {
        // odebrani sdileneho postu
        console.log(req.body.idOfSharedPost)
        await SharedPost.findByIdAndDelete(req.body.idOfSharedPost);

        // jesli se nenaskytla zadna chyba
        res.status(200).json("prispevek byl smazan"); 
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post("/ifAlreadyShared", async (req, res) => {
    try {
        // hledani jestli jiz uzivatel nahodou uz sdilel stejny prispevek samemu uzivateli
        const ifAlreadyShared = await SharedPost.findOne({userId: req.body.userId, idOfSharingToUser: req.body.idOfSharingToUser, idOfMainPost: req.body.idOfMainPost});  
        res.status(200).json(ifAlreadyShared); 
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;