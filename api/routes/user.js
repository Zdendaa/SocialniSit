const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt'); // knihovna na zahesovani hesla

/** REGISTROVANI */
router.post("/register", async (req, res) => {
    try {
        // zaheshovani hesla pomoci bcrypt
        const salt = await  bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // vytvoreni noveho uzivatele
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        //console.log(newUser)
        // ulozeni uzivatele do databaze
        const user = await newUser.save();

        // status jesli se neobjevila chyba jestli ne posleme data uzivatele ve tvaru json
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
        console.log(err)
    }
})

/** PRIHLASOVANI */
router.post("/login", async (req, res,) => {
    try {
        // vyhledani uzivatele pomoci emailu ktery jsme zadali 
        const user = await User.findOne({email: req.body.email})
        // jeslize se uzivatele nepovedlo najit posleme chybu
        !user && res.status(404).send("user not found");

        // porovname heslo uzivatele a heslo ktere jsme zadali
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        // jeslize se hesla neshoduji posleme chybu
        !validPassword && res.status(400).send("wrong password");

        // posleme data uzivatele ve tvaru json
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;