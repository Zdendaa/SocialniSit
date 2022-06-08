import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import TopBarHome from '../components/TopBarHome';
import SwiperOnlineFriends from '../components/SwiperOnlineFriends';
import AddNewPost from '../components/AddNewPost';
import axios from 'axios';
import Post from '../components/Post';
import Notifications from '../components/Notifications';
import StoriesMain from '../components/StoriesMain';
import changePath from '../changePath';

const Home = () => {
    const { user } = useContext(GlobalContext);
    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState([]);
    const [usersIdOfPost, setUsersIdOfPost] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            // nacteni postu naseho uzivatele
            const posts = await axios.get(changePath(`/posts/getAllPosts/${user._id}`));

            const usersIdData = [];
            posts.data.forEach(post => {
                usersIdData.push(post.userId);
            });
            const uniqueUsersIdData = [...new Set(usersIdData)]; // odstraneni duplicitnich hodnot (id uzivatelu)
            const usersIdPostData = await axios.post(changePath(`/users/getAllUsersData`), { users: uniqueUsersIdData }); // nacteni dat vsech vlastniku postu
            setUsersIdOfPost(usersIdPostData.data);

            // serazeni od nejnovejsich postu po ty uplne posledni 
            const sortPosts = posts.data.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt) });
            setPosts(sortPosts);
        }
        getPosts();
    }, [user._id])

    useEffect(() => {
        const getFrinends = async () => {
            // nacteni pratel
            const users = await axios.get(changePath(`/users/getAllFriends/${user._id}`));
            setUsers(users.data);
        }
        getFrinends();
    }, [user._id])


    return (
        <div className="homeContainer">
            <TopBarHome />
            <SwiperOnlineFriends users={users} type={1} />

            <div className="homeContainerPostsMain">
                <div className="homeContainerPosts">
                    <StoriesMain />
                    <AddNewPost friends={users} />
                    {
                        posts?.map((post, index) => (
                            <Post post={post} key={index} userOfPost={usersIdOfPost.filter(user => user._id === post.userId)[0]} />
                        ))
                    }
                </div>
                <SwiperOnlineFriends users={users} className="pc" type={2} />
            </div>
            <Notifications />
        </div>
    )
}

export default Home
