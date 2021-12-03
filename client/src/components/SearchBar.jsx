import React, { useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import changePath from '../changePath';
import axios from 'axios';
import UserProfile from '../components/UserProfile';

const SearchBar = () => {
    const [isTyping, setIsTyping] = useState(false);

    const [users, setUsers] = useState([]);

    const searchUsers = async (value) => {
        if(value === "") {
            setUsers([])
        } else {
            const newUsers = await axios.get(changePath(`/users/getSearchPeople/${value}`));
            console.log(newUsers.data)
            setUsers(newUsers.data);
        }
    }
    return (
        <div>
            <BiSearchAlt className={isTyping ? "none" : "searchIcon scaled"} onClick={() => setIsTyping(!isTyping)}/>
            <div className={isTyping ? "resultSearchContainer" : "none"}>
                <input onChange={(e) => searchUsers(e.target.value)}type="text" style={isTyping ? {width: "250px"} : {width: "0px"}}/>
                <span onClick={() => setIsTyping(!isTyping)}>x</span>
                
                <div style={{position: "absolute", width: "150px", top: "50px", backgroundColor: "white"}}>
                {
                    users?.map(user => (
                        <UserProfile idOfUser={user._id} key={user._id} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                    ))
                }
                </div>
               
            </div>
        </div>
    )
}

export default SearchBar
