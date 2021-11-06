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

/** ZJISTENI ZDA LI UZIVATEL JIZ NEEXISTUJE SE STEJNYM JMENEM A PREZDIVKOU */
router.post("/ifUserExist", async (req, res) => {
    try {
        // kontrolovani zda li uzivatel nahodou jiz existuje se stejnym jmenem nebo emailem
        const userUsername = await User.find({username: req.body.username});
        const userEmail = await User.find({email: req.body.email});
        if (userUsername.length === 0 && userEmail.length === 0) {    
            res.status(200).json(false); // vse v poradku uzivatel muze pokracovat v registraci
        } else {
            res.status(200).json(true); // error uzivatel jiz existuje se stejmym emailem nebo jmenem
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

/*POSLANI NEBO ODEBRANI ZADOSTI O PRATELSTVI*/
router.put("/addOrRemoveRequest/:idOfUser/:myId", async (req, res) => {
    try {
        // najdeme uzivatele kteremu posilame zadost
        const user = await User.findById(req.params.idOfUser);
        // jeslit uz uzivatel jiz neposlal zadost, uzivateli ulozime nase id do idOfRequests
        if (!user.idOfRequests.includes(req.params.myId)) {
            await user.updateOne({ $push: { idOfRequests: req.params.myId } });
        } else {
            // jeslit uzivatel jiz poslal zadost, zadost odebereme
            await user.updateOne({ $pull: { idOfRequests: req.params.myId } });
        }

        res.status(200).send("zadost byla odeslana");
    } catch (err) {
        res.status(500).json(err);
    }
})

/*PRIJMUTI NEBO ODMITNUTI ZADOSTI O PRATELSTVI*/
router.put("/addFriend/:idOfUser/:myId", async (req, res) => {
    try {
        // najdeme oba uzivatele
        const user1 = await User.findById(req.params.idOfUser);
        const user2 = await User.findById(req.params.myId);
        
        if (!user1.idOfFriends.includes(req.params.myId) && !user2.idOfFriends.includes(req.params.idOfUser)) {
            await user1.updateOne({ $push: { idOfFriends: req.params.myId } });
            await user2.updateOne({ $push: { idOfFriends: req.params.idOfUser } });

            await user2.updateOne({ $pull: { idOfRequests: req.params.idOfUser } });

        }


        res.status(200).send("nyni jste pratele");
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put("/removeFriend/:idOfUser/:myId", async (req, res) => {
    try {
        // najdeme uzivatele kteremu posilame zadost
        const user1 = await User.findById(req.params.idOfUser);
        const user2 = await User.findById(req.params.myId);
        // odebereme jak sobe ta uzivteli obe id v idOfFriends
        await user1.updateOne({ $pull: { idOfFriends: req.params.myId } });
        await user2.updateOne({ $pull: { idOfFriends: req.params.idOfUser } });

        res.status(200).send("zadost byla odeslana");
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;