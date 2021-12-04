import React, { useContext, useEffect, useState } from 'react'
import { TiDelete } from 'react-icons/ti';
import { GlobalContext } from '../context/GlobalState'
import UserProfile from './UserProfile'
import axios from 'axios';
import changePath from '../changePath';
import SharingButton from './SharingButton';

const Share = ({ setifSharing, idOfPost }) => {
    // zavolani prihlaseneho usera
    const {user, backgroundColor1} = useContext(GlobalContext);

    // promenna pro ulozeni dat pratel
    const [allFriends, setAllFriends] = useState([]);

    // promenna pro ulozeni obsahu v inputu
    const [valOfInput, setValOfInput] = useState("");

    useEffect(() => {
        // nacteni vsech pratel
        const loadAllUsersFriends = async () => {
            const friends = await axios.get(`/users/getAllFriends/${user._id}`);
            setAllFriends(friends.data);
            console.log(friends.data);
        }
        loadAllUsersFriends();
    }, [user._id]);

    // funkce

    const addSharedPost = async (id, ifIsShare, idOfPost, idOfSharedPost) => {
        if(ifIsShare) {
           await axios.post(changePath("/sharedPosts/removeSharedPost"), {idOfSharedPost:idOfSharedPost});
        } else {
            const postData = {
                userId: user._id,
                idOfSharingToUser: id,
                desc: valOfInput,
                idOfMainPost: idOfPost
            }
            await axios.post(changePath("/sharedPosts/addSharedPost"), postData);
        }
        
    }

    return (
        <div className="Share">
            <div className="shareContainer">
                <h4 style={{color: backgroundColor1}}>Sdílet všem přátelům</h4>
                <div className="shareMainBox">
                    <input type="text" className="inputValShare" placeholder="napsat něco k danému sdílenému příspěvku..." onChange={(e) => setValOfInput(e.target.value)} value={valOfInput}/>
                    <SharingButton addSharedPost={addSharedPost} idOfPost={idOfPost} />
                </div>
                <h4 style={{color: backgroundColor1}}>Nebo sdílet pouze některým</h4>
                <div className="shareAllFriends">
                {
                    allFriends?.map((friends) => (    
                        <UserProfile idOfUser={friends._id} style={{width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover"}} sharing={true} addSharedPost={addSharedPost} idOfPost={idOfPost} />          
                    ))
                }
                </div>
                <TiDelete className="scaled removeImgShow" onClick={() => setifSharing(ifSharing => !ifSharing)} />
            </div>
        </div>
    )
}

export default Share
