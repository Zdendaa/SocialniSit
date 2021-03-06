import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import Story from './Story';
import { AnimatePresence, motion } from 'framer-motion';
import AddStory from './AddStory';
import StoriesBook from './StoriesBook';

const StoriesMain = () => {
    const { user } = useContext(GlobalContext);
    const [allStories, setAllStories] = useState([]);
    const [width, setWidth] = useState(0);
    const carouselMain = useRef();
    const [isOpenAddStory, setIsOpenAddStory] = useState(false);
    const [idOfCurrentOpenStory, setIdOfCurrentOpenStory] = useState(null);
    const [isVisibleStoriesBook, setIsVisibleStoriesBook] = useState(false);
    const [usersOfStory, setUsersOfStory] = useState([]);

    useEffect(() => {
        const fetchAllStories = async () => {
            const stories = await axios.get(changePath(`/stories/getAllStories/${user._id}`));

            const usersIdData = [];
            stories.data.forEach(story => {
                usersIdData.push(story.idOfUser);
            });
            const uniqueUsersIdData = [...new Set(usersIdData)]; // odstraneni duplicitnich hodnot (id uzivatelu)
            const usersIdPostData = await axios.post(changePath(`/users/getAllUsersData`), { users: uniqueUsersIdData }); // nacteni dat vsech vlastniku story
            setUsersOfStory(usersIdPostData.data);
            setAllStories(stories.data);

        }
        fetchAllStories();
    }, [user._id])

    useEffect(() => {
        setWidth(carouselMain.current.scrollWidth - carouselMain.current.offsetWidth);
    }, [allStories])


    return (
        <div className="StoriesMain" ref={carouselMain} whiletap={{ cursor: "grabbing" }}>
            <motion.div
                drag="x"
                dragConstraints={{ right: 0, left: -width }}
                className="stories"
            >
                <Story type={1} setIsOpenAddStory={setIsOpenAddStory} />
                {
                    allStories?.map((story) => (
                        <Story story={story} key={story._id} setIdOfCurrentOpenStory={setIdOfCurrentOpenStory} setIsVisibleStoriesBook={setIsVisibleStoriesBook} />
                    ))
                }
            </motion.div>
            <AnimatePresence
                initial={false}
                exitBeforeEnter={true}
                onExitComplete={() => null}
            >
                {
                    isOpenAddStory &&
                    <AddStory setIsOpenAddStory={setIsOpenAddStory} />
                }
                {
                    isVisibleStoriesBook &&
                    <StoriesBook users={usersOfStory} idOfCurrentOpenStory={idOfCurrentOpenStory} setIsVisibleStoriesBook={setIsVisibleStoriesBook} allStories={allStories} />
                }
            </AnimatePresence>
        </div>
    )
}

export default StoriesMain