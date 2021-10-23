import axios from 'axios';
import React, {useContext, useEffect, useState } from 'react'
import { downloadUrlImg, getUrlImgOrNull } from '../storageImgActions/imgFunctions';
import { format, register } from 'timeago.js';
import czDataFormat from '../format.jsCZ/CzFormat';
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { GlobalContext } from '../context/GlobalState'
import Comments from './Comments';

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

    // promenna pro zobrazeni profilove fotky uzivatele
    const [urlProfilePicture, setUrlProfilePicture] = useState(null);

    // promenna pro zobrazeni fotky v prispevku
    const [urlImages, setUrlImages] = useState(null);

   

    useEffect(() => {
        // funkce pro ziskani dat vlastnika prispevku
        const getUser = async () => {
            const userOfPost = await axios.get(`/users/getUser/${post.userId}`);
            setUserOfPost(userOfPost.data)
            await downloadUrl(userOfPost.data);
        }
        const downloadUrl = async (user) => {
            // dostanu url obrazku uzivatele
            setUrlProfilePicture(await getUrlImgOrNull(user));
            post.idOfImg ? (setUrlImages(await downloadUrlImg(`posts/${user?.username}/${post.idOfImg}`))) : (post.urlOfImg ? setUrlImages(post.urlOfImg) : setUrlImages(null));
        }
        getUser();
    }, [post.idOfImg, post.urlOfImg, post.userId])

    // funkce 
    const addOrRemoveLike = async () => {
        ifIsLiked ? setLenghtOfLikes(lenght => lenght - 1) : setLenghtOfLikes(lenght => lenght + 1);
        setIfIsLiked(!ifIsLiked);
        await axios.put(`/posts/addOrRemoveLike/${post._id}`, { userId: user._id })
    }
    return (
        <div className="post">
            <div className="postContainer">
                <div className="userContainerPost">
                    <div className="userDivPost">
                        <img className="profilePicture" src={urlProfilePicture ? urlProfilePicture : "img/anonymous.png"} alt="" />
                        <span>{userOfPost?.username}</span>
                    </div>
                    <span>{format(post.createdAt, 'myLanguage')}</span>
                </div>
                <div className="postContent">
                    <span className="postDescContent">{post.desc}</span>
                    {urlImages && <img className="postImg" src={urlImages} alt="" />}
                </div>
                <div className="postBottom">
                    {ifIsLiked ? <FcLike style={{fontSize: "35px"}} onClick={addOrRemoveLike} /> : <FcLikePlaceholder style={{fontSize: "35px"}} onClick={addOrRemoveLike} /> }
                    
                    <span>{lenghtOfLikes}</span><br />

                    <Comments post={post}/>
                    
                </div>
            </div>
        </div>
    )
}

export default Post
