import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { getUrlImgOrNull } from '../storageImgActions/imgFunctions';
import UserProfile from '../components/UserProfile';

const Profile = () => {
    const { user } = useContext(GlobalContext);

    // promenna useParams, z url adresy jsme dostali promennou idOfUser
    const { idOfUser } = useParams();
    
    // useState promenne

    // prihlaseny uzivatel
    const [myUser, setMyUser] = useState(null);

    // promenna pro url obrazku
    const [url, setUrl] = useState("");

    // zda jsou v pratelstvi
    const [ifAreFriends, setIfAreFriends] = useState(null);

    // zda uz uzivatel poslal zadost o pratelstvi
    const [ifSendRequest, setIfSendRequtest] = useState(null)

    // prihlaseny uzivatel
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const downloadUrl = async () => {
            // jestli uzivatel kouka ne jaho profil
            if (idOfUser === user._id) {
                // ziskame nase url profiloveho obrazku
                setUrl(await getUrlImgOrNull(user));
            } else {
                // ziskame data profilu na ktery prave koukame
                const currentUser = await axios.get(changePath(`/users/getUser/${idOfUser}`));
                // ziskame jeho url profiloveho obrazku
                setUrl(await getUrlImgOrNull(currentUser.data));
            }
           
        }
        downloadUrl();
    }, [idOfUser, user])

    useEffect(() => {
        const downloadDataOfUser = async () => {
            // ziskame data prave prihlaseneho uzivatele
            const myUser = await axios.get(changePath(`/users/getUser/${user._id}`));
            setMyUser(myUser.data);  
        }
        downloadDataOfUser();
    }, [idOfUser, user._id])    

    useEffect(() => {
        const setValueOfVariables = async () => {
                // ziskame data profilu na ktery prave koukame
                const currentUser = await axios.get(changePath(`/users/getUser/${idOfUser}`));
                setCurrentUser(currentUser.data);
                // zjistime zda jsme pratele 
                setIfAreFriends(currentUser.data.idOfFriends.includes(user._id));
                // zjistime zda jsem mu neposlal zadost o pratelstvi
                setIfSendRequtest(currentUser.data.idOfRequests.includes(user._id));
        }
        setValueOfVariables();
    }, [idOfUser, user._id])

    // funkce

    // pridani nebo odebrani zadosti
    const addOrRemoveRequestToUser = async () => {
        setIfSendRequtest(!ifSendRequest);
        await axios.put(changePath(`/users/addOrRemoveRequest/${idOfUser}/${user._id }`));
    }

    // prijmuti zadosti
    const confirmRequest = async (id) => {
        setIfAreFriends(true);
        await axios.put(changePath(`/users/addFriend/${id}/${user._id }`));
    }

    // zruseni pratelstvi
    const removeFriend = async (id) => {
        setIfAreFriends(false);
        await axios.put(changePath(`/users/removeFriend/${idOfUser}/${user._id }`));
    }

    return (
        <div className="Profile">

            <div className="yourProfile">

                <div className="yourProfileTop">
                    <img src={url ? url : "/img/anonymous.png"} alt="" />
                    {
                    idOfUser === user._id 
                    ? 
                    (
                        <div className="requestsContainer">
                        {
                            myUser?.idOfRequests.map(id => (
                                <div>
                                    <UserProfile idOfUser={id} style={{widht: "50px", height: "50px", borderRadius: "50%"}} />
                                    <button onClick={() => confirmRequest(id)}>přijmout nebo odmítnout žádost o přátelství</button>
                                </div>
                            ))
                        }
                        </div>
                    ) 
                    : 
                    (
                        <>
                            {
                            ifAreFriends 
                            ? 
                            <button onClick={removeFriend}>odebrat přítele</button> 
                            :
                            myUser?.idOfRequests.includes(idOfUser)
                            ? 
                            <button onClick={() => confirmRequest(idOfUser)}>přijmout žádost</button> 
                            : 
                            <button onClick={addOrRemoveRequestToUser}>{ifSendRequest ? "odebrat žádost" : "poslat žádost"}</button>
                            }
                        </>
                    )
                    }      
                            <div className="friendsContainer">
                                <span>pratele</span>
                                {
                                    currentUser?.idOfFriends.map(idOfFriend => (
                                        <UserProfile idOfUser={idOfFriend} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                                    ))
                                }
                            </div>
                            
                        </div>
                    </div>
        </div>
    )
}

export default Profile
