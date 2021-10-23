const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt'); // knihovna na zahesovani hesla

/** REGISTROVANI */
router.post("/register", async (req, res) => {
    try {
        // zaheshovani hesla pomoci bcrypt
        const salt = await  bcrypt.genSalt(10);

        const hashedPassword = !req.body.isGoogleAccount ? await bcrypt.hash(req.body.password, salt) : null;

        // vytvoreni noveho uzivatele
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            idOrUrlOfProfilePicture: req.body.idOrUrlOfProfilePicture,
            isGoogleAccount: req.body.isGoogleAccount
        })
        console.log(newUser)
        // ulozeni uzivatele do databaze
        const user = await newUser.save();

        // status jesli se neobjevila chyba jestli ne posleme data uzivatele ve tvaru json
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

/** PRIHLASOVANI */
router.post("/login", async (req, res) => {
    try {
        // vyhledani uzivatele pomoci emailu ktery jsme zadali 
        const user = await User.findOne({email: req.body.email});
        // jeslize se uzivatele nepovedlo najit posleme chybu
        !user && res.status(404).send("user not found");

        if(req.body.isGoogleAccount) {
            console.log("google")
        } else {
            console.log("normal")
            // porovname heslo uzivatele a heslo ktere jsme zadali
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            // jeslize se hesla neshoduji posleme chybu
            !validPassword && res.status(400).send("wrong password");
        }
        
        // posleme data uzivatele ve tvaru json
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

/** DOSTAT DATA UZIVATELE POMOCI ID UZIVATELE*/
router.get("/getUser/:userId", async (req, res) => {
    try {
        // vyhledani uzivatele pomoci emailu ktery jsme zadali 
        const user = await User.findById(req.params.userId);
        // jeslize se uzivatele nepovedlo najit posleme chybu
        !user && res.status(404).send("user not found");
        
        // posleme data uzivatele ve tvaru json
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

/** DOSTAT DATA UZIVATELE POMOCI ID UZIVATELE*/
router.get("/getAllUsers", async (req, res) => {
    try {
        // vyhledani vsech uzivatelu
        const users = await User.find();
        
        // posleme data uzivatele ve tvaru json
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;