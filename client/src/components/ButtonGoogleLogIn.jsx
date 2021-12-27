import axios from 'axios';
import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import { firebase } from '../firebaseStorage/storage'
import { useHistory } from 'react-router'
import changePath from '../changePath';
import { FcGoogle } from 'react-icons/fc';

const ButtonGoogleLogIn = () => {
    const {setUser, setColors} = useContext(GlobalContext);

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

                    // zjisteni zda existuje UserColors
                    const ifExistUserColors = await axios.get(changePath(`userColors/ifUserColorsExist/${newUser.data._id}`))
                    // jestli existuej tak ulozime do local storage a take do context api barvy uzivatele
                    if(ifExistUserColors.data) {
                        localStorage.setItem("colors", JSON.stringify({backgroundColor1: ifExistUserColors.data.backgroundColor1, backgroundColor2: ifExistUserColors.data.backgroundColor2, backgroundColor3: ifExistUserColors.data.backgroundColor3, backgroundColor4: ifExistUserColors.data.backgroundColor4})); 
                        setColors({backgroundColor1: ifExistUserColors.data.backgroundColor1, backgroundColor2: ifExistUserColors.data.backgroundColor2, backgroundColor3: ifExistUserColors.data.backgroundColor3, backgroundColor4: ifExistUserColors.data.backgroundColor4});
                    } 

                    saveUser(newUser);
                } catch (err) {
                    // jestli uzivatel neexistuje registrujeme ho a vytvroime zaznam v tabulce images
                    await axios.post(changePath("/images/createNew"), {url: data.user.photoURL});
                    // vytvoreni zaznamu v tabulkce users
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
        const newUserData = userData.data;
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
