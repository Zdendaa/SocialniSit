import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState'
import UserProfile from './UserProfile'
import axios from 'axios';
import changePath from '../changePath';
import SharingButton from './SharingButton';
import PopupWindown from './global/PopupWindown';
import EmojiPicker from './addMessageVariants/EmojiPicker';

const Share = ({ setifSharing, idOfPost, sendNotification }) => {
    // zavolani prihlaseneho usera
    const { user, backgroundColor1 } = useContext(GlobalContext);

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


        if (ifIsShare) {
            await axios.post(changePath("/sharedPosts/removeSharedPost"), { idOfSharedPost: idOfSharedPost });
            if (id) {
                console.log("zrusil sdileni s id" + id)
                await sendNotification(id, 3, null, idOfPost, "odebral sdílení", true);
            } else {

                allFriends.forEach(async (friend) => {
                    await sendNotification(friend._id, 3, null, idOfPost, "odebral sdílení", true);
                })

                console.log("zrusil sdileni bez id")
            }
        } else {
            const postData = {
                userId: user._id,
                idOfSharingToUser: id,
                desc: valOfInput,
                idOfMainPost: idOfPost
            }
            await axios.post(changePath("/sharedPosts/addSharedPost"), postData);

            if (id) {
                console.log("sdili s id")
                await sendNotification(id, 3, null, idOfPost, "sdílí", true);
            } else {
                console.log("sdili bez id")

                allFriends.forEach(async (friend) => {
                    await sendNotification(friend._id, 3, null, idOfPost, "sdílí", true);
                })

            }
        }

    }

    return (
        <PopupWindown classNameMain="Share" classNameContainer="shareContainer" setVisible={setifSharing}>
            <h4 style={{ color: backgroundColor1 }}>Sdílet všem přátelům</h4>
            <div className="shareMainBox">
                <input type="text" className="inputValShare" placeholder="napsat něco k danému sdílenému příspěvku..." onChange={(e) => setValOfInput(e.target.value)} value={valOfInput} />
                <EmojiPicker setValOfText={setValOfInput} />
                <SharingButton addSharedPost={addSharedPost} idOfPost={idOfPost} />
            </div>
            <h4 style={{ color: backgroundColor1 }}>Nebo sdílet pouze některým</h4>
            <div className="shareAllFriends">
                {
                    allFriends?.map((friends) => (
                        <UserProfile idOfUser={friends._id} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} sharing={true} addSharedPost={addSharedPost} idOfPost={idOfPost} />
                    ))
                }
            </div>
        </PopupWindown>
    )
}

export default Share
