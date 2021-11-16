import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { getUrlImgOrNull } from '../storageImgActions/imgFunctions';
import TopBarHome from '../components/TopBarHome';
import TopProfile from '../components/TopProfile';
import ProfileRequests from '../components/ProfileRequests';
import SwiperOnlineFriends from '../components/SwiperOnlineFriends';
import AddNewPost from '../components/AddNewPost';
import Post from '../components/Post';

const Profile = () => {
    const { user, backgroundColor1} = useContext(GlobalContext);

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
                setUrl(await getUrlImgOrNull(user));
            } else {
                // ziskame data profilu na ktery prave koukame
                const currentUser = await axios.get(changePath(`/users/getUser/${idOfUser}`));
                // ulozime vlastnika profilu
                setCurrentUser(currentUser.data);
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
            const sortPosts = posts.data.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt)});
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
        /*
        currentUser?.idOfFriends.forEach(async (idOfUser) => {
            var userJson = await axios.get(changePath(`/users/getUser/${idOfUser}`));
            var userData = userJson.data;
            setAllFriends(friends => [...friends, userData]);
        })*/
    }
    

    // pridani nebo odebrani zadosti
    const addOrRemoveRequestToUser = async () => {
        setIfSendRequtest(!ifSendRequest);
        await axios.put(changePath(`/users/addOrRemoveRequest/${idOfUser}/${user._id }`));
    }

    // prijmuti zadosti
    const confirmRequest = async (id) => {
        const userOfRequest = await axios.get(changePath(`/users/getUser/${id}`));
        setArrayIdOfFriends(arrayIdOfFriends.filter(idOfrequests => idOfrequests !== id));
        setAllFriends(friends => [...friends, userOfRequest.data]);
        //console.log(allFriends);
        setIfAreFriends(true);
        await axios.put(changePath(`/users/addFriend/${id}/${user._id }`));
    }

    // zruseni pratelstvi
    const removeFriend = async () => {
        setIfAreFriends(false);
        setAllFriends((allFriends.filter(friends => friends._id !== user._id)));
        await axios.put(changePath(`/users/removeFriend/${idOfUser}/${user._id }`));
    }

    return (
        <div className="Profile">
            <TopBarHome />
            <TopProfile url={url} user={currentUser} removeFriend={removeFriend} ifAreFriends={ifAreFriends} myUser={myUser} idOfUser={idOfUser} addOrRemoveRequestToUser={addOrRemoveRequestToUser} ifSendRequest={ifSendRequest} confirmRequest={confirmRequest}/>
            

            <div className="profileContainer">
                <div className="profileAllAboutContainer">
                    {
                    idOfUser === user._id && <ProfileRequests confirmRequest={confirmRequest} idOfRequests={arrayIdOfFriends}/>
                    }
                    <div className="profileAllAbout">
                        <div className="profileImages">

                        </div>
                        <div className="profileInfo">
                            <div className="profileInfoContainers">
                                <span>Popis:</span>
                                <span style={{color: backgroundColor1, fontWeight: "500"}}>Jsem nej bytost na světě</span>
                            </div>
                            <div className="profileInfoContainers">
                                <span>Bydlí v:</span>
                                <span style={{color: backgroundColor1, fontWeight: "500"}}>Ustí nad labem</span>
                            </div>
                            <div className="profileInfoContainers">
                                <span>Vztah:</span>
                                <span style={{color: backgroundColor1, fontWeight: "500"}}>Single</span>
                            </div>
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
                            
                                <Post post={post} key={index}/> 
                            
                        ))
                    }
                </div>
            </div>
            
        </div>
    )
}

export default Profile
