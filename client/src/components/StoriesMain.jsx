import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import Story from './Story';
import { motion } from 'framer-motion';

const StoriesMain = () => {
    const {user} = useContext(GlobalContext);
    const [allStories, setAllStories] = useState([]);
    const [width, setWidth] = useState(0);
    const carouselMain = useRef();

    useEffect(() => {
        const fetchAllStories = async () => {
            const stories = await axios.get(changePath(`/stories/getAllStories/${user._id}`));
            setAllStories(stories.data[0]);
        }
        fetchAllStories();
    }, [user._id])

    useEffect(() => {   
        setWidth(carouselMain.current.scrollWidth - carouselMain.current.offsetWidth);
    }, [allStories])
    

    return (
      <div className="StoriesMain" ref={carouselMain} whiletap={{cursor: "grabbing"}}>
          <motion.div 
            drag="x"
            dragConstraints={{right: 0, left: -width}}
            className="stories"
          >
              <Story type={1}/>
            {
                allStories.map((story) => (
                        <Story story={story} key={story._id}/>
                ))
            }
          </motion.div>
      </div>
    )
}

export default StoriesMain