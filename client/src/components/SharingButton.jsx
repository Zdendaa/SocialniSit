import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import ClipLoader from "react-spinners/ClipLoader";

const SharingButton = ({addSharedPost, idOfUser, idOfPost }) => {
    const {backgroundColor2, backgroundColor1, user} = useContext(GlobalContext);

    // promenna zda li uz uzivatel sdilel prispevek tomuto uzivateli
    const [ifIsShare, setIfIsShare] = useState(false);

    // prmenna pro id sdileneho postu jestli jiz existuje
    const [idOfSharedPost, setIdOfSharedPost] = useState(null);

    // waiting
    const [ifLoading, setIfLoading] = useState(false);

    useEffect(() => {
        ifAlreadyShare();
    }, [])

    // funkce
    const ifAlreadyShare = async () => {
        const postData = {
            userId: user._id,
            idOfSharingToUser: idOfUser,
            idOfMainPost: idOfPost
        }

        const sharedPost = await axios.post(changePath("/sharedPosts/ifAlreadyShared"), postData);
       
        setIdOfSharedPost(sharedPost.data ? sharedPost.data._id : null);
        setIfIsShare(sharedPost.data ? true : false);
    }
    const addOrRemovePost = async () => {
        setIfLoading(true)
        await addSharedPost(idOfUser, ifIsShare, idOfPost, idOfSharedPost).then( async () => {
            await ifAlreadyShare().then(() => {
                setIfLoading(false);
                setIfIsShare(!ifIsShare);
            });
        });
        
    }
    return (
        <>
            <button onClick={ async () => await addOrRemovePost()} className="shareButton opacity" style={{backgroundColor: backgroundColor1, color: backgroundColor2}}>{ifLoading ? <ClipLoader color={backgroundColor2} size={10} ></ClipLoader> : ifIsShare ? "sdíleno" : "sdílej"}</button>
        </>
    )
}

export default SharingButton
