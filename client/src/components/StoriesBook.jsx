import React, { useContext, useEffect, useState } from 'react'
import PopupWindown from './global/PopupWindown';
import { motion } from 'framer-motion';
import axios from 'axios';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const StoriesBook = ({ idOfCurrentOpenStory, setIsVisibleStoriesBook, allStories }) => {
    const { onlineFriends } = useContext(GlobalContext);
console.log(onlineFriends);
    const [indexOfStory, setIndexOfStory] = useState(allStories.findIndex((storie) => storie._id === idOfCurrentOpenStory))
    const [userOfStory, setUserOfStory] = useState(null);

    useEffect(() => {
        const fetchDataOfUser = async () => {
            const dataOfUser = await axios.get(changePath(`/users/getUser/${allStories[indexOfStory].idOfUser}`));
            setUserOfStory(dataOfUser.data);
        }
        fetchDataOfUser();
    }, [indexOfStory, allStories])

    const nextStory = () => { 
        if(indexOfStory === allStories.length - 1) {
            setIndexOfStory(0);
        } else {
            setIndexOfStory(prev => prev + 1);
        }
    }
    const prevStory = () => {
        if(indexOfStory > 0) {
            setIndexOfStory(prev => prev - 1);
        } else {
            setIndexOfStory(allStories.length - 1);
        }
    }

    return (
      <PopupWindown classNameMain="StoryBook" classNameContainer="storyBookContainer" setVisible={setIsVisibleStoriesBook}>
        <motion.div className="mainContainerStoryBook"
            initial={{ rotate: 45 }} 
            animate={{ rotate: 0 }} 
            exit={{ rotate: -45 }}
        >
            
            <img src={allStories[indexOfStory].urlOfImg} alt="storyImg" className="storyImg storyBookImgWidthAndHeight" />
            <span className={allStories[indexOfStory].position}><h2 style={{padding: "5px"}}>{allStories[indexOfStory].text}</h2></span>
            <Link to={`/profile/${userOfStory?._id}`} className="profileContainerStory">
                <div className="profileImgMain">
                    <img src={userOfStory?.idOrUrlOfProfilePicture ? userOfStory?.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="profileImg" className="profileImgStory"/>
                    {onlineFriends?.some(onlineUser => onlineUser.userId === userOfStory?._id) && <div className="onlineUserStory"></div>}
                </div>
                <span>{userOfStory?.username}</span>  
            </Link>
        </motion.div>
        <IoIosArrowBack onClick={() => prevStory() } className="buttonNext buttonStoryBook" />
        <IoIosArrowForward onClick={() => nextStory() } className="buttonPrev buttonStoryBook" />
      </PopupWindown>
    )
}

export default StoriesBook