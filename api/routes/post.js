const router = require('express').Router();
const Post = require('../models/Post');
const SharedPost = require('../models/SharedPost');
const User = require('../models/User');

/** PRIDAVANI POSTU */
router.post("/addPost", async (req, res) => {
    try {
        // vytvoreni noveho postu
        const post = new Post({
            userId: req.body.userId,
            desc: req.body.desc,
            urlOfImg: req.body.urlOfImg
        })
        // ulozeni postu do db
        const newPost = await post.save();

        // jesli se nenaskytla zadna chyba posleme data noveho postu
        res.status(200).json(newPost); 
    } catch (err) {
        res.status(500).json(err);
    }
})

/* DOSTANI VSECH TVYCH POSTU A VSECH OD TVOJICH PRATEL (TIMELINE)*/
router.get("/getAllPosts/:userId", async (req, res) => {
    try {
        // vyhledani naseho uzivatele pomoci userId 
        const currentUser = await User.findById(req.params.userId);
        // vyhledani vsech postu naseho uzivatele pomoci userId
        const userPosts = await Post.find({userId: req.params.userId});

        // vyhledani vsech prispevku ktere sdilel nas uzivatel
        const sharedPosts = await SharedPost.find({userId: req.params.userId});

        const userSharedPosts = await Promise.all(
            sharedPosts.map(async (sharedPost) => {
                const dataOfSharedPost = await Post.findById(sharedPost.idOfMainPost);
                    
                const newDataOfPost = {
                    _id: dataOfSharedPost._id,
                    userId: dataOfSharedPost.userId,
                    desc: dataOfSharedPost.desc,
                    urlOfImg: dataOfSharedPost.urlOfImg,
                    idOfLikes: dataOfSharedPost.idOfLikes,
                    idOfComment: dataOfSharedPost.idOfComment,
                    createdAt: sharedPost.createdAt,
                    sharedUserId: sharedPost.userId,
                    sharedDesc: sharedPost.desc
                }
                return newDataOfPost;
            })
        )

        // vyhledani vsech postu nasich kamaradu
        const allFriendsPosts = await Promise.all(
            currentUser.idOfFriends.map(async (friendId) => {
                const sharedPosts = await SharedPost.find({userId: friendId}); // vyhledam vsechny nam sdilene prispevky od jesdnoho uzivatele

                const allSharedPosts = await Promise.all(sharedPosts.map(async (sharedPost) => {
                    // jetli je prispevek sdílený pro všechny přátelé nebo jen pro našeho uživatele
                    if(!sharedPost.idOfSharingToUser || sharedPost.idOfSharingToUser === req.params.userId) {
                        // nahrajeme si vsechny dane prispevky
                        const dataOfSharedPost = await Post.findById(sharedPost.idOfMainPost);
                    
                        const newDataOfPost = {
                            _id: dataOfSharedPost._id,
                            userId: dataOfSharedPost.userId,
                            desc: dataOfSharedPost.desc,
                            urlOfImg: dataOfSharedPost.urlOfImg,
                            idOfLikes: dataOfSharedPost.idOfLikes,
                            idOfComment: dataOfSharedPost.idOfComment,
                            createdAt: sharedPost.createdAt,
                            idOfSharingToUser: sharedPost.idOfSharingToUser,
                            sharedDesc: sharedPost.desc
                        }
                        return newDataOfPost;
                    }  
                }));
                // vyfiltrovani z pole vsechny nulove hodnoty
                const allPosts = allSharedPosts.filter(x => x != null);

                const newPost = await Post.find({userId: friendId}); // vsechny prispevky daneho uzivatele
                
                return sharedPosts ? newPost.concat(allPosts) : newPost; // spojeni vsech postu nasich kamaradu a vsech postu ktere nasi kamaradi sdileli
            })
        );

        // spjojeni vsech prispevk naseho uzivatele a vsech prispevku ktere sdilel
        const allPosts = userPosts.concat(...userSharedPosts);
        // spojeni vsech postu od naseho uzivatele a vsech postu nasich pratel
        const timeLinePosts = allPosts.concat(...allFriendsPosts);

        // jesli se nenaskytla zadna chyba posleme data noveho postu
        res.status(200).json(timeLinePosts); 
    } catch (err) {
        res.status(500).json(err);
    }
})

/* PRIDANI NEBO ODEBRANI LIKEU*/
router.put("/addOrRemoveLike/:id", async (req, res) => {
    try {
        // najdeme post u ktereho chceme znenit likey
        const post = await Post.findById(req.params.id);
        // pokud jsme tento post jeste nelikely tak pridame like
        if(!post.idOfLikes.includes(req.body.userId)) {
            await post.updateOne({ $push: { idOfLikes: req.body.userId }});
            res.status(200).send("k prispevku byl pridan like");
        } else {
        // pokud jsme tento post uz likely tak like odebereme
            await post.updateOne({ $pull: { idOfLikes: req.body.userId }});
            res.status(200).send("like byl odebran z prispevku");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

/* DOSTANI VSECH POSTU OD JEDNOHO UZIVATELE*/
router.get("/getPosts/:userId", async (req, res) => {
    try {
        // dostat vsechny vase posty
        const ourPosts = await Post.find({userId: req.params.userId});

        // vyhledani vsech prispevku ktere sdilel nas uzivatel
        const sharedPosts = await SharedPost.find({userId: req.params.userId});
        
        const userSharedPosts = await Promise.all(
            sharedPosts.map(async (sharedPost) => {
                const dataOfSharedPost = await Post.findById(sharedPost.idOfMainPost);
                    
                const newDataOfPost = {
                    _id: dataOfSharedPost._id,
                    userId: dataOfSharedPost.userId,
                    desc: dataOfSharedPost.desc,
                    urlOfImg: dataOfSharedPost.urlOfImg,
                    idOfLikes: dataOfSharedPost.idOfLikes,
                    idOfComment: dataOfSharedPost.idOfComment,
                    createdAt: sharedPost.createdAt,
                    sharedUserId: sharedPost.userId,
                    sharedDesc: sharedPost.desc
                }
                return newDataOfPost;
            })
        )

        const allPosts = ourPosts.concat(...userSharedPosts);

        // jesli se nenaskytla zadna chyba posleme data noveho postu
        res.status(200).json(allPosts); 
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;