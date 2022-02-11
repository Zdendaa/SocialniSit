import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { MdAddCircleOutline } from 'react-icons/md';

const Story = ({ story, type }) => {
    const { onlineFriends, user} = useContext(GlobalContext);

    const [userOfStory, setUserOfStory] = useState();

    useEffect(() => {
        const fetchDataOfUser = async () => {
            if(story) {
                const dataOfUser = await axios.get(changePath(`/users/getUser/${story.idOfUser}`));
                setUserOfStory(dataOfUser.data);
            }    
        }
        fetchDataOfUser();
    }, [])
    return (
        <div className="Story storyWidthAndHeight">
            {
                type === 1 ? (
                    <div onClick={() => console.log("klikk")} >
                        <img src={user.idOrUrlOfProfilePicture} alt="storyImg" className="storyImg storyWidthAndHeight" />
                            <div className="profileContainerAddStory">
                                <MdAddCircleOutline className="iconAddStory" style={{color: "black"}}/>
                                <span>Vytvořte příběh</span>
                            </div>
                    </div>
                ) : (
                    <>
                        <img src="https://cdn.britannica.com/82/195482-050-2373E635/Amalfi-Italy.jpg" alt="storyImg" className="storyImg storyWidthAndHeight" />
                        <div className="profileContainerStory">
                            <div className="profileImgMain">
                                <img src="http://learnenglish.britishcouncil.org/sites/podcasts/files/2021-10/RS6715_492969113-hig.jpg" alt="profileImg" className="profileImgStory"/>
                                {onlineFriends.onlineFriends?.some(onlineUser => onlineUser.userId === userOfStory._id) && <div className="onlineUserStory"></div>}
                            </div>
                            <span>{userOfStory?.username}</span>
                            
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Story