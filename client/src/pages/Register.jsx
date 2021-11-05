import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router';
import { GlobalContext } from '../context/GlobalState'
import { uploadImg } from '../storageImgActions/imgFunctions'
import axios from 'axios'
import ButtonGoogleLogIn from '../components/ButtonGoogleLogIn';
import { Link } from 'react-router-dom'
import changePath from '../changePath';
import { AiOutlineArrowRight } from 'react-icons/ai';
import validator from 'validator';
import ClipLoader from "react-spinners/ClipLoader";
import { TiDelete } from 'react-icons/ti'

const Register = () => {
    // vypujceni promenne user a funkce setUser z context api
    const {setUser, backgroundColor1, backgroundColor2} = useContext(GlobalContext);

    // useState promenne
    // promenna useState jesli se nacita stranka
    const [ifWaiting, setIfWaiting] = useState(false);

    // promenne useState pro chybove hlasky
    const [errName, setErrName] = useState("");
    const [errPassword, setErrPassword] = useState("");
    const [errPasswordConfirm, setErrPasswordConfirm] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [userExist, setUserExist] = useState("");

    // promenne useState pro porovnani s potvrzenym heslem
    const [passwordValue, setpasswordValue] = useState("");
    const [passwordConfirmValue, setPasswordConfirmValue] = useState("");

    // useState promenna pro ulozeni a ukazani obrazku ktery uzivatel vybral
    const [image, setImage] = useState(null);

    // useRef promenne
    const name = useRef(null);
    const password = useRef(null);
    const email = useRef(null);

    // useHistory ( pouziva se k presmerovani stranky)
    const history = useHistory();


    // funkce

    // zkontrolovani dat ve formulari a ulozeni chybove hlasky
    const checkInput = async (what, value) => {
        // what 1 name   2 password    3 passwordConfirm    4 email
        what === 1 && (value !== "" ? setErrName(null) : setErrName("Jméno je povinné"));
        what === 2 && (value !== "" ? (value === passwordConfirmValue ? setRight(true, true) : setRight(true, false)) : setErrPassword("Heslo je povinné"));
        what === 3 && (value !== "" ? (value === passwordValue ? setErrPasswordConfirm(null): setErrPasswordConfirm("Potvrzení hesla musí být stejné jako heslo")) : setErrPasswordConfirm("Potvrzení hesla je povinné"));
        what === 4 && (value !== "" ? (validator.isEmail(value) ? setErrEmail(null) : setErrEmail("neplatný email")) : setErrEmail("email je povinný"));       
    }

    const setRight = (password, passwordConfirm) => {
        password && setErrPassword(null); 
        passwordConfirm ? setErrPasswordConfirm(null) : setErrPasswordConfirm("Potvrzení hesla musí být stejné jako heslo");
    }

    // vytvoreni uzivatele
    const createUser = async () => {
        // zjisteni jestli data ve formulari jsou sparvna 
        const isItRight = ((!errEmail && !errPassword && !errPasswordConfirm && !errName) && (errEmail !== "" && errPassword !== "" && !errPasswordConfirm !== "" && !errName !== "")) ? true : false;

        // jeslit jsou data spravna pokracujeme v prihlaseni
        if(isItRight) {
            // nacitani nastavime na true
            setIfWaiting(true);

            // zjisitme zda li uzivatel jiz neexistuje se stejnym jmenem nebo emailem
            const ifUserExist = await axios.post(changePath("/users/ifUserExist"), {username: name.current.value, email: email.current.value})
            
            if (ifUserExist.data) {    
                // uzivatel jiz existuje 
                setUserExist("uživatel již existuje s tímto jménem nebo emailem");
                setIfWaiting(false);
            } else {
                try {
                    // jestli uzivatel vybral obrazek tak se vytvori zaznam v tabulkce images
                    const img = image ? await axios.post(changePath("/images/createNew"), {name: image.name}) : null;
                    
                    // jestli existuje img ulozi se img do storage
                    if(img) {
                        const newImgName = "users/" + name.current.value + "/" + img.data._id;
                        await uploadImg(image, newImgName).then(async() => {
                        await setAndSaveUser(img);
                        });
                    } else {
                        await setAndSaveUser(img);
                    }
                                    
                } catch (err) {
                    // jestli se nepodari prihlasit uzivatele nastavime nacitani na false 
                    setIfWaiting(false);
                }
            }
        } else {
            // jeslit uzivatel nezadal zadna data vyhodime chybouve hlasky
            errName === "" && checkInput(1, "");
            errPassword === "" && checkInput(2, "");
            errPasswordConfirm === "" && checkInput(3, "");
            errEmail === "" && checkInput(4, "");
        }
        
    }

    const setAndSaveUser = async (img) => {
        const newUser = {
            username: name.current.value,
            email: email.current.value,
            password: password.current.value,
            idOrUrlOfProfilePicture: img ? img.data._id : null, // id obrazku ktery jsme uz ulozili
            isGoogleAccount: false,
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
                    <input className="inputRegister" onChange={(e) => checkInput(1, e.target.value)} style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="name" ref={name} placeholder="jméno" required/>
                    {(errName !== "" && errName) && <span className="errorMessage">{errName}</span>}
                    <input className="inputRegister" onChange={(e) => checkInput(4, e.target.value)} style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="email" ref={email} placeholder="email" required/>
                    {(errEmail !== "" && errEmail) && <span className="errorMessage">{errEmail}</span>}
                    <input className="inputRegister" onChange={(e) => {checkInput(2, e.target.value); setpasswordValue(e.target.value); }} style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="password" ref={password} placeholder="heslo" required/>
                    {(errPassword !== "" && errPassword) && <span className="errorMessage">{errPassword}</span>}
                    <input className="inputRegister" onChange={(e) => {checkInput(3, e.target.value); setPasswordConfirmValue(e.target.value); }} style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="password" placeholder="potrvdit heslo" required/>
                    {(errPasswordConfirm !== "" && errPasswordConfirm) && <span className="errorMessage">{errPasswordConfirm}</span>}
                    {(userExist !== "" && userExist) && <span className="errorMessage">{userExist}</span>}
                    <label htmlFor="fileUpload" id="inputfileRegister" className="inputRegister" style={{backgroundColor: backgroundColor1, color: "white" }} >
                        <span>vybrat profilovou fotku</span>
                    </label>
                    <input id="fileUpload" key={image || ''} type="file" accept="image/*"  onChange={(e) => setImage(e.target.files[0])} required/>
                    {image && 
                        <div className="imgShowContainer">
                            <img src={URL.createObjectURL(image)} alt="img" className="imgShow"/>
                            <TiDelete className="removeImgShow" onClick={(e) => {setImage(null)}} />
                        </div>
                    }
                    
                    <button className="buttonRegister inputRegister" style={{backgroundColor: backgroundColor1, color: "white" }} onClick={createUser}>{!ifWaiting ? <span>Registrovat</span> : <ClipLoader color={backgroundColor2} size={10} />}</button>    
                    <span>nebo</span>        
                        <ButtonGoogleLogIn />
                        <Link to="/login" className="goToLogInButton inputRegister" style={{backgroundColor: backgroundColor1}}>{!ifWaiting ? <><span>Příhlásit se</span> <AiOutlineArrowRight className="ArrowImg"/></> : <ClipLoader color={backgroundColor2} size={10} />}</Link>
                </div>
            </div>
        </div>
    )
}

export default Register
