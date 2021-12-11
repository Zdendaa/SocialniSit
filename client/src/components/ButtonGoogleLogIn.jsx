import axios from 'axios';
import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import { firebase } from '../firebaseStorage/storage'
import { useHistory } from 'react-router'
import changePath from '../changePath';
import { FcGoogle } from 'react-icons/fc';

const ButtonGoogleLogIn = () => {
    const {setUser} = useContext(GlobalContext);

    // useHistory ( pouziva se k presmerovani stranky)
    const history = useHistory();

    const createUserGoogle = async () => {

            var googleProvider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(googleProvider).then( async (data) => {   
                
                try {
                    // jestli uzivatel uz existuje jenom ho prihlasime
                    const userData = {
                        email: data.user.email,
                        password: null,
                        isGoogleAccount: true
                    }
                    const newUser = await axios.post(changePath("/users/login"), userData);
                    saveUser(newUser);
                } catch (err) {
                    console.log("ach jaj");
                    // jestli uzivatel neexistuje registrujeme ho
                    const newUser = {
                        username: data.user.displayName,
                        email: data.user.email,
                        password: null,
                        idOrUrlOfProfilePicture: data.user.photoURL,
                        isGoogleAccount: true
                    }
        
                    // vytvoreni zaznamu v tabulkce users
                    const userData = await axios.post(changePath("/users/register"), newUser);
                    saveUser(userData);
                }
            })
            .catch((err) => {
                console.log(err);
            })   
    }

    const saveUser = (userData) => {
        console.log(userData);
        const newUserData = userData.data;
        console.log(userData);
        // ulozeni uzivatele do local storage aby uzivatel byl ulozeny i po refreshnuti stranky
        localStorage.setItem("user", JSON.stringify(newUserData));

        // volani funkce v GlobalProvider a ulozeni uzivatele do initialState
        setUser(newUserData);

        // presmerovani na stranku home
        history.push("/");
    }

    
    return (
        <>
            <button onClick={createUserGoogle} className="createGoogleButton inputRegister buttonRegister">
                 <FcGoogle className="googleImg"/>
                 <span>Pokračovat skrze google účet</span>
            </button>
        </>
    )
}

export default ButtonGoogleLogIn
