import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { GlobalContext } from '../context/GlobalState';
import TopBarHome from '../components/TopBarHome';
import SwiperOnlineFriends from '../components/SwiperOnlineFriends';
import AddNewPost from '../components/AddNewPost';
import axios from 'axios';
import Post from '../components/Post';




const Home = () => {
    const {deleteUser} = useContext(GlobalContext);
    const history = useHistory();
    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
       const getPosts = async () => {
        
           const posts = await axios.get("/posts/getAllPosts")

           // serazeni od nejnovejsich postu po ty uplne posledni
           const sortPosts = posts.data.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt)});
           setPosts(sortPosts);

           const users = await axios.get("/users/getAllUsers");
            setUsers(users.data);
           console.log(users.data);
          
       }
       getPosts();
    }, [])
    
    
    return (
        <div className="homeContainer">           
             <TopBarHome />
             <button onClick={ () => { 
                localStorage.removeItem("user");
                deleteUser();
                history.push("/register");
                
             } }>log out</button>
             <SwiperOnlineFriends users={users}/>
             <div className="homeContainerPosts">
                <AddNewPost />    
                {
                    posts?.map((post, index) => (
                        <Post post={post} key={index}/> 
                    ))
                }
             </div>
        </div>
    )
}

export default Home
