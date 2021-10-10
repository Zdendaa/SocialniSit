import axios from 'axios';
import React, { useContext, useRef } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import changePath from '../changePath';
import ButtonGoogleLogIn from '../components/ButtonGoogleLogIn';
import { GlobalContext } from '../context/GlobalState';

const Login = () => {
    const {setUser, backgroundColor1, backgroundColor2} = useContext(GlobalContext);

    // promenne useRef
    const email = useRef(null);
    const password = useRef(null);

    // useHistory ( pouziva se k presmerovani stranky)
    const history = useHistory();


    const logIn = async () => {
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
        
    }
    return (
        <div className="Login">
            <div className="loginContainer">
                
                <div className="rotateDiv1" style={{backgroundColor: backgroundColor1}}></div>
                <div className="rotateDiv2" style={{backgroundColor: backgroundColor1}}></div>
                <div className="loginForm">
                    <h2 style={{color: backgroundColor1}}>Přihlásit se</h2>
                    <input className="inputRegister" style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="email" placeholder="email" ref={email} required/>
                    <input className="inputRegister" style={{backgroundColor: backgroundColor2, color: backgroundColor1}} type="password" placeholder="heslo" ref={password} required/>
                    <button className="buttonRegister inputRegister" style={{backgroundColor: backgroundColor1, color: "white" }} onClick={logIn}>příhlásit</button> <br/>
                    <ButtonGoogleLogIn />
                    <Link to="/register" className="goToLogInButton inputRegister" style={{backgroundColor: backgroundColor1}}><span>Registrovat se</span> <AiOutlineArrowRight className="ArrowImg"/></Link>
                </div>
            </div>
        </div>
        
    )
}

export default Login
