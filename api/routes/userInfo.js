const router = require('express').Router();
const UserInfo = require('../models/UserInfo');

/*VYTVORENI NOVEHO ZAZNAMU V USERINFO*/
router.post("/createUserInfo", async (req, res) => {
    try {   
        const dataUserInfo = new UserInfo({
            idOfUser: req.body.idOfUser,
            desc: req.body.desc,
            from: req.body.from,
            relationShip: req.body.relationShip
        })
        const userInfo = await dataUserInfo.save();

        res.status(200).send(userInfo);
    } catch (err) {
        res.status(500).json(err);
    }
})

/*VYHLEDANI USERINFO PODLE ID UZIVATELE*/
router.get("/getUserInfo/:id", async (req, res) => {
    try {   
        const userInfo = await UserInfo.findOne({idOfUser: req.params.id});

        res.status(200).send(userInfo);
    } catch (err) {
        res.status(500).json(err);
    }
})

/*ZJISTENI ZDA USERINFO UZ EXISTUJE */
router.post("/ifInfoExist", async (req, res) => {
    try {
        // kontrolovani zda li userInfo jiz nahodou existuje
        const userInfo = await UserInfo.find({idOfUser: req.body.id});
        if (userInfo.length === 0) {    
            res.status(200).json(false); // userInfo neexistuje
        } else {
            res.status(200).json(true); // userInfo jiz existuje
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

/*AKTUALIZOVANI HODNOT V USERINFU*/
router.put("/updateInfo", async (req, res) => {
    try {
        // vyhledani infa UZIVATELE
        const currentInfo = await UserInfo.findOne({idOfUser: req.body.idOfUser});
        // aktualizovani dat infa
        await currentInfo.updateOne({$set: {desc: req.body.desc, from: req.body.from, relationShip: req.body.relationShip}});

        res.status(200).json("info o uzivateli bylo aktulizovano");
    } catch (err) {
        res.status(500).json(err);
    }
})



module.exports = router;