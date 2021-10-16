import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import changePath from '../changePath';
import ButtonGoogleLogIn from '../components/ButtonGoogleLogIn';
import { GlobalContext } from '../context/GlobalState';
import validator from 'validator';
import ClipLoader from "react-spinners/ClipLoader";

const Login = () => {
    const {setUser, backgroundColor1, backgroundColor2} = useContext(GlobalContext);

    // promenna useState jesli se nacita stranka
    const [ifWaiting, setIfWaiting] = useState(false);

    // promenne useState pro chybove hlasky
    const [errEmail, setErrEmail] = useState("");
    const [errPassword, setErrPassword] = useState("");

    // promenne useRef
    const email = useRef(null);
    const password = useRef(null);

    // useHistory ( pouziva se k presmerovani stranky)
    const history = useHistory();

    // funkce 

    // zkontrolovani dat ve formulari a ulozeni chybove hlasky
    const checkInput = async (what, value) => {
        // what 1 email   2 password   
        what === 1 && (!value == "" ? (validator.isEmail(value) ? setErrEmail(null) : setErrEmail("neplatný email")) : setErrEmail("email je povinný"))  ;
        what === 2 && (!value == "" ? setErrPassword(null) : setErrPassword("heslo je povinné"))
    }

    const logIn = async () => {
        // zjisteni jestli data ve formulari jsou sparvna 
        const isItRight = ((!errEmail && !errPassword) && (errEmail != "" && errPassword != "")) ? true : false;

        // jeslit jsou data spravna pokracujeme v prihlaseni
        if(isItRight) {
            try {
                // nacitani nastavime na true
                setIfWaiting(true);

                const data = {
                    email: email.current.value, 
                    password: password.current.value
                }
                // zjisteni jeslit uzivatel existuje a email i heslo se shoduje
                const newUser = await axios.post(changePath("/users/login"), data);
                    
                const newUserData = newUser.data;
                    
                // ulozeni uzivatele do local storage aby uzivatel byl ulozeny i po refreshnuti stranky
                localStorage.setItem("user", JSON.stringify(newUserData));
            
                // volani funkce v GlobalProvider a ulozeni uzivatele do initialState
                setUser(newUserData);
            
                // presmerovani na stranku home
                history.push("/");
            } catch (err) {
                // jestli se nepodari prihlasit uzivatele nastavime nacitani na false 
                setIfWaiting(false);
            }
            
        } else {
            // jeslit data nejsou spravna zkontrolujeme chyby
            errEmail == "" && checkInput(1, "");
            errPassword == "" && checkInput(2, "");
        }
    }
    return (
        <div className="Login">
            <div className="loginContainer">
                
                <div className="rotateDiv1" style={{backgroundColor: backgroundColor1}}></div>
                <div className="rotateDiv2" style={{backgroundColor: backgroundColor1}}></div>
                <div className="loginForm">
                    
                    <h2 style={{color: backgroundColor1}}>Přihlásit se</h2>
                    <input className="inputRegister" onChange={(e) => { checkInput(1, e.target.value)}} ref={email} style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="email" placeholder="email"/>
                    {(errEmail !== "" && errEmail) && <span className="errorMessage">{errEmail}</span>}
                    <input className="inputRegister" onChange={(e) => { checkInput(2, e.target.value)}} ref={password} style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="password" placeholder="heslo"/>
                    {(errPassword  !== "" && errPassword) && <span className="errorMessage">{errPassword}</span>}
                    <button className="buttonRegister inputRegister" style={{backgroundColor: backgroundColor1, color: "white"}} onClick={logIn}>{!ifWaiting ? "Přihlásit" : <ClipLoader color={backgroundColor2} size={10} />}</button> <br/>
                    <ButtonGoogleLogIn />
                    <Link to="/register" className="goToLogInButton inputRegister" style={{backgroundColor: backgroundColor1}}>{!ifWaiting ? (<><span>Registrovat</span><AiOutlineArrowRight className="ArrowImg"/></>) : <ClipLoader color={backgroundColor2} size={10} />}</Link>
                </div>
            </div>
        </div>
        
    )
}

export default Login
