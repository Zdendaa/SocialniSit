import axios from 'axios';
import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import { firebase } from '../firebaseStorage/storage'
import { useHistory } from 'react-router'

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
                        idGoogleAccount: data.user.idGoogleAccount
                    }
                    const newUser = await axios.post("/users/login", userData);
                    saveUser(newUser);
                } catch (err) {
                    console.log("ach jaj");
                    // jestli uzivatel neexistuje registrujeme ho
                    const newUser = {
                        username: data.user.displayName,
                        email: data.user.email,
                        password: null,
                        idOrUrlOfProfilePicture: data.user.photoURL,
                        idGoogleAccount: true
                    }
        
                    // vytvoreni zaznamu v tabulkce users
                    const userData = await axios.post("/users/register", newUser);
                    saveUser(userData);
                }
            })
            .catch((err) => {
                console.log(err);
            })   
    }

    const saveUser = (userData) => {
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
        <div>
             <button onClick={createUserGoogle}>Pokracovat skrze google ucet</button>
        </div>
    )
}

export default ButtonGoogleLogIn
