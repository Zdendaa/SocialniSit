import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router';
import { GlobalContext } from '../context/GlobalState'
import { uploadImg } from '../storageImgActions/imgFunctions'
import axios from 'axios'
import ButtonGoogleLogIn from '../components/ButtonGoogleLogIn';
import { Link } from 'react-router-dom'
import changePath from '../changePath';
import { AiOutlineArrowRight } from 'react-icons/ai';

const Register = () => {
    // vypujceni promenne user a funkce setUser z context api
    const {setUser, backgroundColor1, backgroundColor2} = useContext(GlobalContext);

    // useRef promenne
    const name = useRef(null);
    const password = useRef(null);
    const email = useRef(null);

    // useState promenne
    const [image, setImage] = useState(null);

    // useHistory ( pouziva se k presmerovani stranky)
    const history = useHistory();


    // funkce

    // vytvoreni uzivatele
    const createUser = async () => {

        // vytvoreni zaznamu v tabulkce images
        const img = await axios.post(changePath("/images/createNew"), {name: image.name});
        
        // ulozeni img do storage
        const newImgName = img.data._id;
        await uploadImg(image, newImgName);

        const newUser = {
            username: name.current.value,
            email: email.current.value,
            password: password.current.value,
            idOrUrlOfProfilePicture: img.data._id, // id obrazku ktery jsme uz ulozili
            idGoogleAccount: false,
        }

        // vytvoreni zaznamu v tabulkce users
        const userData = await axios.post(changePath("/users/register"), newUser);
        const newUserData = userData.data;
        
        // ulozeni uzivatele do local storage aby uzivatel byl ulozeny i po refreshnuti stranky
        localStorage.setItem("user", JSON.stringify(newUserData));

        // volani funkce v GlobalProvider a ulozeni uzivatele do initialState
        setUser(newUserData);

        // presmerovani na stranku home
        history.push("/");
        
    }

    

    return (
        <div className="Register">
            <div className="registerContainer">
                <div className="rotateDiv1" style={{backgroundColor: backgroundColor1}}></div>
                <div className="rotateDiv2" style={{backgroundColor: backgroundColor1}}></div>
                <div className="registerForm">
                    <h2 style={{color: backgroundColor1}}>Registrace</h2>
                    <input className="inputRegister" style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="name" ref={name} placeholder="jméno" required/>
                    <input className="inputRegister" style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="email" ref={email} placeholder="email" required/>
                    <input className="inputRegister" style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="password" ref={password} placeholder="heslo" required/>
                    <input className="inputRegister" style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="password" placeholder="potrvdit heslo" required/>
                    <label for="fileUpload" id="inputfileRegister" className="inputRegister" style={{backgroundColor: backgroundColor1, color: "white" }} >
                        <span>vybrat profilovou fotku</span>
                    </label>
                    <input id="fileUpload" type="file" onChange={(e) => setImage(e.target.files[0])} required/>
                    <button className="buttonRegister inputRegister" style={{backgroundColor: backgroundColor1, color: "white" }} onClick={createUser}><span>Registrovat</span></button>    
                    <span>nebo</span>        
                        <ButtonGoogleLogIn />
                        <Link to="/login" className="goToLogInButton inputRegister" style={{backgroundColor: backgroundColor1}}><span>Příhlásit se</span> <AiOutlineArrowRight className="ArrowImg"/></Link>
                </div>
            </div>
        </div>
    )
}

export default Register
