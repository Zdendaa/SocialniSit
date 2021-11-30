import axios from 'axios';
import React, {useContext, useEffect, useState } from 'react'
import { downloadUrlImg, getUrlImgOrNull } from '../storageImgActions/imgFunctions';
import { format, register } from 'timeago.js';
import czDataFormat from '../format.jsCZ/CzFormat';
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { FiShare } from "react-icons/fi"
import { GlobalContext } from '../context/GlobalState'
import Comments from './Comments';
import changePath from '../changePath';
import { Link } from "react-router-dom";
import Share from './Share';

const Post = ({post}) => {
    // registrovani cestiny do formatjs
    register('myLanguage', czDataFormat);

    // zavolani prihlaseneho usera
    const {user} = useContext(GlobalContext);
    
    // Promenne UseState

    // promenna pro pocet liku
    const [lenghtOfLikes, setLenghtOfLikes] = useState(post.idOfLikes.length);

    // promenna zdali jsem prispevek likenul
    const [ifIsLiked, setIfIsLiked] = useState(post.idOfLikes.includes(user._id));

    // promenna pro ulozeni vlastnika prispevku
    const [userOfPost, setUserOfPost] = useState(null);

    // promenna pro zjisteni zda je uzivatel sdilejici prispevek
    const [ifSharing, setifSharing] = useState(false);

    useEffect(() => {
        // funkce pro ziskani dat vlastnika prispevku
        const getUser = async () => {
            const userOfPost = await axios.get(changePath(`/users/getUser/${post.userId}`));
            setUserOfPost(userOfPost.data)
        }
        getUser();
    }, [post.userId])

    // funkce 

    // pridani nebo odebrani likeu
    const addOrRemoveLike = async () => {
        ifIsLiked ? setLenghtOfLikes(lenght => lenght - 1) : setLenghtOfLikes(lenght => lenght + 1);
        setIfIsLiked(!ifIsLiked);
        await axios.put(changePath(`/posts/addOrRemoveLike/${post._id}`), { userId: user._id })
    }
    
    return (
        <div className="post">
            <div className="postContainer">
                <div className="userContainerPost">
                    <Link to={`profile/${userOfPost?._id}`} className="userDivPost">
                        <img className="profilePicture" src={userOfPost?.idOrUrlOfProfilePicture ? userOfPost?.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="" />
                        <span>{userOfPost?.username}</span>
                    </Link>    
                    <span>{format(post.createdAt, 'myLanguage')}</span>
                </div>
                <div className="postContent">
                    <span className="postDescContent">{post.desc}</span>
                    {post.urlOfImg && <img className="postImg" src={post.urlOfImg} alt="" />}
                </div>
                <div className="postBottom">
                    <div className="acitonsForPosts">
                        {ifIsLiked ? <FcLike style={{fontSize: "35px"}} className="scaled" onClick={addOrRemoveLike} /> : <FcLikePlaceholder className="scaled" style={{fontSize: "35px"}} onClick={addOrRemoveLike} /> }
                        <FiShare onClick={() => setifSharing(!ifSharing)}/>
                        
                    </div>
                    
                    <span>{lenghtOfLikes}</span><br />

                    <Comments post={post} key={post._id}/>
                    
                </div>
            </div>
            {ifSharing && <> <div className="wallPaperNotWorking"></div> <Share setifSharing={setifSharing}/> </> }
            
        </div>
    )
}

export default Post
