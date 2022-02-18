import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { MdAddCircleOutline } from 'react-icons/md';

const Story = ({ story, type, setIsOpenAddStory }) => {
    const { onlineFriends, user } = useContext(GlobalContext);

    const [userOfStory, setUserOfStory] = useState();
    
    useEffect(() => {
        const fetchDataOfUser = async () => {
            if(story) {
                const dataOfUser = await axios.get(changePath(`/users/getUser/${story.idOfUser}`));
                setUserOfStory(dataOfUser.data);
            }    
        }
        fetchDataOfUser();
    }, [story])
    return (
        <div className="Story storyWidthAndHeight">
            {
                type === 1 ? (
                    <div onClick={() => setIsOpenAddStory(true) } >
                        <img src={user.idOrUrlOfProfilePicture ? user.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="storyImg" className="storyImg storyWidthAndHeight" />
                            <div className="profileContainerAddStory">
                                <MdAddCircleOutline className="iconAddStory" style={{color: "black"}}/>
                                <span>Vytvořte příběh</span>
                            </div>
                    </div>
                ) : (
                    <>
                        <img src={story.urlOfImg} alt="storyImg" className="storyImg storyWidthAndHeight" />
                        <div className="profileContainerStory">
                            <div className="profileImgMain">
                                <img src={userOfStory?.idOrUrlOfProfilePicture ? userOfStory?.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="profileImg" className="profileImgStory"/>
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