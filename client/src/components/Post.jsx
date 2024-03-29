import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { format, register } from 'timeago.js';
import czDataFormat from '../format.jsCZ/CzFormat';
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { FaShare } from "react-icons/fa"
import { GlobalContext } from '../context/GlobalState'
import Comments from './Comments';
import changePath from '../changePath';
import { Link } from "react-router-dom";
import Share from './Share';
import UserProfile from './UserProfile';
import { AnimatePresence } from 'framer-motion';

const Post = ({ post, userOfPost }) => {
    // registrovani cestiny do formatjs
    register('myLanguage', czDataFormat);

    // zavolani prihlaseneho usera
    const { user, socket, backgroundColor1, backgroundColor3, onlineFriends } = useContext(GlobalContext);

    // Promenne UseState

    // promenna pro pocet liku
    const [lenghtOfLikes, setLenghtOfLikes] = useState(post.idOfLikes.length);

    // promenna zdali jsem prispevek likenul
    const [ifIsLiked, setIfIsLiked] = useState(post.idOfLikes.includes(user._id));

    // promenna pro zjisteni zda uzivatel jiz sdili prispevek
    const [ifSharing, setifSharing] = useState(false);

    
    // promenna pro ulozeni vlastnika prispevku v notifikacich
    const [mainUserOfPost, setMainUserOfPost] = useState(userOfPost);

    useEffect(() => {
        // funkce pro ziskani dat vlastnika prispevku
        const getUser = async () => {

            const userOfPost = await axios.get(changePath(`/users/getUser/${post.userId}`));
            setMainUserOfPost(userOfPost.data)
        }
        !userOfPost && getUser();
    }, [post.userId])
    

    const sendNotification = async (recieverId, type, url, idOfPost, text, share) => {
        // pridani notifikace do db

        if (user._id === post.userId && !share) return;
        console.log(recieverId)

        await axios.post(changePath(`/notifications/addNotification`), { senderId: user._id, recieverId, type, url, idOfPost, text });
        // pridani notifikace do socket.io serveru
        socket.emit("sendNotification", { senderId: user._id, recieverId, type, url, idOfPost, readed: false, text });

    }
    // funkce 

    // pridani nebo odebrani likeu
    const addOrRemoveLike = async () => {
        var text = !ifIsLiked ? "přidal/a like" : "odebral/a like";
        ifIsLiked ? setLenghtOfLikes(lenght => lenght - 1) : setLenghtOfLikes(lenght => lenght + 1);
        setIfIsLiked(!ifIsLiked);
        await axios.put(changePath(`/posts/addOrRemoveLike/${post._id}`), { userId: user._id });
        await sendNotification(post.userId, 1, null, post._id, text);
    }

    return (
        <div className="post">
            <div className="postContainer">
                {post?.sharedUserId &&
                    <>
                        <div style={{ marginBottom: "15px" }}><UserProfile idOfUser={post?.sharedUserId} sharingPost={true} createdAt={post.createdAt} style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "50%" }} /> </div>
                        <span style={{ color: backgroundColor3 }}>{post.sharedDesc}</span>
                        <hr className="lineNewPost" style={{ backgroundColor: backgroundColor1 }} />
                    </>
                }
                <div className="userContainerPost">
                    <Link to={`/profile/${mainUserOfPost?._id}`} className="userProfile">
                        <div className="mainImg">
                            <img className="profilePicture" src={mainUserOfPost?.idOrUrlOfProfilePicture ? mainUserOfPost?.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="" referrerPolicy="no-referrer" />
                            {onlineFriends?.some(onlineUser => onlineUser.userId === mainUserOfPost?._id) && <div className="online" style={{ border: "2px solid white" }}></div>}
                        </div>
                        <span style={{ color: backgroundColor3 }}>{mainUserOfPost?.username}</span>
                        {post?.newPicture && <span style={{ color: backgroundColor1 }}>přidal/a novou fotku</span>}
                    </Link>
                    {post?.sharedPostCreatedAt ?
                        <span style={{ color: backgroundColor3 }}>{format(post.sharedPostCreatedAt, 'myLanguage')}</span>
                        :
                        <span style={{ color: backgroundColor3 }}>{format(post.createdAt, 'myLanguage')}</span>
                    }
                </div>
                <div className="postContent">
                    <span className="postDescContent" style={{ color: backgroundColor3 }}>{post.desc}</span>
                    {post.urlOfImg && <img className="postImg" src={post.urlOfImg} alt="" referrerPolicy="no-referrer" />}
                    {post.urlOfVideo &&
                        (post?.urlOfVideo?.includes("youtu") || post?.urlOfVideo?.includes(".gif")
                        ?
                        <iframe autoPlay={1} className="videoShowAddPost videoMargin" src={post.urlOfVideo} alt="" referrerPolicy="no-referrer" ></iframe>
                        :
                        <video className="videoShowAddPost videoMargin" controls>
                            <source src={post.urlOfVideo} type='video/mp4' />
                        </video>)
                    }
                </div>
                <div className="postBottom">
                    <div className="acitonsForPosts">
                        <div>
                            {ifIsLiked ? <FcLike style={{ fontSize: "35px", cursor: "pointer" }} className="scaled" onClick={addOrRemoveLike} /> : <FcLikePlaceholder className="scaled" style={{ fontSize: "35px", cursor: "pointer" }} onClick={addOrRemoveLike} />}
                            <span style={{ color: backgroundColor3 }}>{lenghtOfLikes}</span>
                        </div>
                        <FaShare style={{ fontSize: "30px", cursor: "pointer", color: backgroundColor1 }} className="scaled" onClick={() => setifSharing(!ifSharing)} />
                    </div>
                    <Comments post={post} key={post._id} sendNotification={sendNotification} />
                </div>
            </div>
            <AnimatePresence
                initial={false}
                exitBeforeEnter={true}
                onExitComplete={() => null}
            >
                {ifSharing && <Share setifSharing={setifSharing} sendNotification={sendNotification} idOfPost={post._id} />}
            </AnimatePresence>
        </div>
    )
}

export default Post


