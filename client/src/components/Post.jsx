import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { downloadUrlImg, getUrlImgOrNull } from '../storageImgActions/imgFunctions';
import { format, render, cancel, register } from 'timeago.js';
import czDataFormat from '../format.ljsCZ/CzFormat';

const Post = ({post}) => {
    register('myLanguage', czDataFormat);

    // promenna pro ulozeni vlastnika prispevku
    const [user, setUser] = useState(null);

    // promenna pro zobrazeni profilove fotky uzivatele
    const [urlProfilePicture, setUrlProfilePicture] = useState(null);

    // promenna pro zobrazeni fotky v prispevku
    const [urlImages, setUrlImages] = useState(null);

    useEffect(() => {
        // funkce pro ziskani dat vlastnika prispevku
        const getUser = async () => {
            const userOfPost = await axios.get(`/users/getUser/${post.userId}`);
            setUser(userOfPost.data)
            await downloadUrl(userOfPost.data);
        }
        const downloadUrl = async (user) => {
            // dostanu url obrazku uzivatele
            setUrlProfilePicture(await getUrlImgOrNull(user));
            post.idOfImg ? (setUrlImages(await downloadUrlImg(`posts/${user?.username}/${post.idOfImg}`))) : (post.urlOfImg ? setUrlImages(post.urlOfImg) : setUrlImages(null));
        }
        getUser();
    }, [post.idOfImg, post.urlOfImg, post.userId])

    return (
        <div className="post">
            <div className="postContainer">
                <div className="userContainerPost">
                    <img className="profilePicture" src={urlProfilePicture ? urlProfilePicture : "img/anonymous.png"} alt="" />
                    <span>{user?.username}</span>
                    <br />
                    <span>{post.desc}</span>
                    <br />
                    <span>{format(post.createdAt, 'myLanguage')}</span>
                </div>
                {urlImages && <img className="postImg" src={urlImages} alt="" />}
            </div>
        </div>
    )
}

export default Post
