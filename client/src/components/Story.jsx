import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { MdAddCircleOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Story = ({ story, type, setIsOpenAddStory, setIdOfCurrentOpenStory, setIsVisibleStoriesBook }) => {
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
                    <div onClick={() => {setIdOfCurrentOpenStory(story._id); setIsVisibleStoriesBook(true) } } >
                        <div style={{position: "relative"}}>
                            <img src={story.urlOfImg} alt="storyImg" className="storyImg storyWidthAndHeight" />
                            <span className={story.position}><span style={{padding: "5px"}}>{story.text}</span></span>
                        </div>
                        
                        <Link to={`/profile/${userOfStory?._id}`} className="profileContainerStory">
                            <div className="profileImgMain">
                                <img src={userOfStory?.idOrUrlOfProfilePicture ? userOfStory?.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="profileImg" className="profileImgStory"/>
                                {onlineFriends?.some(onlineUser => onlineUser.userId === userOfStory?._id) && <div className="onlineUserStory"></div>}
                            </div>
                            <span>{userOfStory?.username}</span>  
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

export default Story