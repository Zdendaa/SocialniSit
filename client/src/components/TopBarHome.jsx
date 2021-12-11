import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useHistory } from 'react-router';

const TopBarHome = () => {
const {user, deleteUser, backgroundColor1} = useContext(GlobalContext);
    const history = useHistory();

    return (
        <div className="topBar" style={{backgroundColor: "white", color: backgroundColor1, borderBottom: "2px solid" + backgroundColor1}}>
            <Link to="/" style={{textDecoration: "none", color: backgroundColor1}}>
                <p className="weight800" style={{cursor: "pointer"}}>Sociální síť</p>
            </Link>
            <SearchBar />
            <div className="topBarProfile">
                <Link to={`/profile/${user._id}`} className="userProfile" style={{color: backgroundColor1}}>
                    <p className="weight800">{user.username}</p>
                    <img className="profilePicture" src={user.idOrUrlOfProfilePicture ? user.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="" referrerPolicy="no-referrer"/>
                </Link>

                <div className="containerLogOut">
                    <button className="buttonLogOut" style={{backgroundColor: backgroundColor1, color: "white"}} onClick={ () => { 
                        localStorage.removeItem("user");
                        deleteUser();
                        history.push("/register");
                        
                    } }>odhlásit se
                    </button>
                    <Link to="/settings" className="buttonLogOut" style={{backgroundColor: backgroundColor1, color: "white", textDecoration: "none", fontSize: "13.33px"}}>nasatvení profilu</Link>
                </div>
            </div>
        </div>
    )
}

export default TopBarHome
