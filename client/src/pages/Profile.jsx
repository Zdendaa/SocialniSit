import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import TopBarHome from '../components/TopBarHome';
import TopProfile from '../components/TopProfile';
import ProfileRequests from '../components/ProfileRequests';
import SwiperOnlineFriends from '../components/SwiperOnlineFriends';
import AddNewPost from '../components/AddNewPost';
import Post from '../components/Post';
import { Link } from 'react-router-dom';
import ImagesOfUser from '../components/ImagesOfUser';
import UserInfo from '../components/UserInfo';
import Notifications from '../components/Notifications';

const Profile = ({ socket }) => {
    const { user, backgroundColor1, backgroundColor4 } = useContext(GlobalContext);
    // promenna useParams, z url adresy jsme dostali promennou idOfUser
    const { idOfUser } = useParams();
    // useState promenne
    
    // prihlaseny uzivatel
    const [myUser, setMyUser] = useState([]);
    
    // promenna pro url profiloveho obrazku
    const [urlOfProfileImg, setUrlOfProfileImg] = useState("");

    // promenna pro url obrazku na pozadi
    const [urlOfCoverImg, setUrlOfCoverImg] = useState("");
    
    // zda jsou v pratelstvi
    const [ifAreFriends, setIfAreFriends] = useState(null);
    
    // zda uz uzivatel poslal zadost o pratelstvi
    const [ifSendRequest, setIfSendRequtest] = useState(null);

    // vsichni kamaradi daneho uzivatele
    const [allFriends, setAllFriends] = useState([]);

    // vsichni kamaradi daneho uzivatele
    const [arrayIdOfFriends, setArrayIdOfFriends] = useState([]);

    // vsechny postu vztazene k danemu uzivateli
    const [allPosts, setAllPosts] = useState([]);

    // vlastnik profilu na ktery koukame
    const [currentUser, setCurrentUser] = useState([]);

    useEffect(() => {
        const downloadUrl = async () => { 
            // jestli uzivatel kouka ne jaho profil
            if (idOfUser === user._id) {
                // ziskame nase url profiloveho obrazku
                setUrlOfProfileImg(user.idOrUrlOfProfilePicture);
                // ziskame jeho url obrazku na pozadi
                setUrlOfCoverImg(user.idOrUrlOfCoverPicture);
            } else {
                // ziskame data profilu na ktery prave koukame
                const currentUser = await axios.get(changePath(`/users/getUser/${idOfUser}`));
                
                // ulozime vlastnika profilu
                setCurrentUser(currentUser.data);
                // ziskame jeho url profiloveho obrazku
                setUrlOfProfileImg(currentUser.data.idOrUrlOfProfilePicture);

                // ziskame jeho url obrazku na pozadi
                setUrlOfCoverImg(currentUser.data.idOrUrlOfCoverPicture);
            }

        }
        downloadUrl();
    }, [idOfUser, user])

    useEffect(() => {
        const downloadDataOfUser = async () => {
            // ziskame data prave prihlaseneho uzivatele
            const myUser = await axios.get(changePath(`/users/getUser/${user._id}`));
            setMyUser(myUser.data);
            setArrayIdOfFriends(myUser.data.idOfRequests);
        }
        downloadDataOfUser();
    }, [idOfUser, user._id])

    useEffect(() => {
        const setValueOfVariables = async () => {
            // ziskame data profilu na ktery prave koukame
            const currentUser = await axios.get(changePath(`/users/getUser/${idOfUser}`));
            await downloadUsers(currentUser.data);
            // zjistime zda jsme pratele 
            setIfAreFriends(currentUser.data.idOfFriends.includes(user._id));
            // zjistime zda jsem mu neposlal zadost o pratelstvi
            setIfSendRequtest(currentUser.data.idOfRequests.includes(user._id));
        }
        setValueOfVariables();
    }, [idOfUser, user._id])

    useEffect(() => {
        const getAllPosts = async () => {
            const posts = await axios.get(changePath(`/posts/getPosts/${idOfUser}`));
            // serazeni od nejnovejsich postu po ty uplne posledni
            const sortPosts = posts.data.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt) });
            setAllPosts(sortPosts);
        }
        getAllPosts();
    }, [idOfUser])

    // funkce

    // stahnuti dat vsech kamaradu daneho uzivatele
    const downloadUsers = async (currentUser) => {
        setAllFriends([]);
        const newAllFriends = await axios.get(changePath(`/users/getAllFriends/${currentUser._id}`))
        setAllFriends(newAllFriends.data);
    }


    // pridani nebo odebrani zadosti 
    const addOrRemoveRequestToUser = async () => {
        if(ifSendRequest) {
            sendNotification(idOfUser, 4, `/profile/${idOfUser}`, null, "odebral žádost o přátelství");
        }else {
            sendNotification(idOfUser, 4, `/profile/${idOfUser}`, null, "poslal žádost o prátelství"); 
        }
        

        setIfSendRequtest(!ifSendRequest);
        await axios.put(changePath(`/users/addOrRemoveRequest/${idOfUser}/${user._id}`));
    }

    // prijmuti zadosti
    const confirmRequest = async (id, myUserId) => {
        const userOfRequest = await axios.get(changePath(`/users/getUser/${myUserId ? myUserId : id}`));
        setArrayIdOfFriends(arrayIdOfFriends.filter(idOfrequests => idOfrequests !== id));
        setAllFriends(friends => [...friends, userOfRequest.data]);
        //console.log(allFriends);
        setIfAreFriends(true);
        await axios.put(changePath(`/users/addFriend/${id}/${user._id}`));
        sendNotification(id, 4, `/profile/${id}`, null, "nyní jste přátelé");
    }

    // zruseni pratelstvi
    const removeFriend = async () => {
        setIfAreFriends(false);
        setAllFriends((allFriends.filter(friends => friends._id !== user._id)));
        await axios.put(changePath(`/users/removeFriend/${idOfUser}/${user._id}`));
    }

    const sendNotification = async (recieverId, type, url, idOfPost, text) => {
        // pridani notifikace do db
        await axios.post(changePath(`/notifications/addNotification`), {senderId: user._id, recieverId, type, url, idOfPost, text});
        // pridani notifikace do socket.io serveru
        socket.emit("sendNotification", {senderId: user._id, recieverId, type, url, idOfPost, readed: false, text});
    }

    return (
        <div className="Profile">
            <TopBarHome />
            <TopProfile urlOfProfileImg={urlOfProfileImg} urlOfCoverImg={urlOfCoverImg} user={currentUser} removeFriend={removeFriend} ifAreFriends={ifAreFriends} myUser={myUser} idOfUser={idOfUser} addOrRemoveRequestToUser={addOrRemoveRequestToUser} ifSendRequest={ifSendRequest} confirmRequest={confirmRequest} />
            
            <div className="profileContainer">
                <div className="profileAllAboutContainer">
                    {
                        idOfUser === user._id && 
                        <>
                            <div className="buttonSettingsContainer">
                                    <Link to="/settings" className="buttonLogOut opacity" style={{backgroundColor: backgroundColor1, color: backgroundColor4, textDecoration: "none", fontSize: "13.33px", padding: "12px", borderRadius: "10px", margin: "0px 0px 15px 0px"}}>nasatvení profilu</Link>
                            </div>
                            <ProfileRequests confirmRequest={confirmRequest} idOfRequests={arrayIdOfFriends} myId={user._id}/>
                        </>
                    }
                    <div className="profileAllAbout">
                        {
                            idOfUser === user._id 
                            ? 
                            <ImagesOfUser user={myUser}/>
                            :
                            <ImagesOfUser user={currentUser}/>
                        }
                        
                        <div className="profileInfo">
                        {
                            idOfUser === user._id 
                            ? 
                            <UserInfo user={myUser}/>
                            :
                            <UserInfo user={currentUser}/>
                        } 
                        </div>
                    </div>
                    <div className="friendsContainer">
                        <span>pratele</span>
                        <SwiperOnlineFriends users={allFriends} type={1} classBorderRadius={"borderRadiusSwiperOnline"} />
                    </div>
                </div>
                <div className="postsActionsContainerProfile">
                    {idOfUser === user._id && <AddNewPost />}
                    {
                        allPosts?.map((post, index) => (
                            <Post post={post} key={index} />
                        ))
                    }
                </div>
            </div>
            <Notifications socket={socket}/>
        </div>
    )
}

export default Profile
