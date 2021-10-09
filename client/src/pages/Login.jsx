import axios from 'axios';
import React, { useContext, useRef } from 'react'
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import ButtonGoogleLogIn from '../components/ButtonGoogleLogIn';
import { GlobalContext } from '../context/GlobalState';

const Login = () => {
    const {setUser} = useContext(GlobalContext);

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
        const newUser = await axios.post("/users/login", data);
            
        const newUserData = newUser.data;
            
        // ulozeni uzivatele do local storage aby uzivatel byl ulozeny i po refreshnuti stranky
        localStorage.setItem("user", JSON.stringify(newUserData));
    
        // volani funkce v GlobalProvider a ulozeni uzivatele do initialState
        setUser(newUserData);
    
        // presmerovani na stranku home
        history.push("/");
        
    }
    return (
        <div>
            <input type="email" placeholder="email" ref={email} required/>
            <input type="password" placeholder="password" ref={password} required/>
            <button onClick={logIn}>prihlasit</button> <br/>
            <ButtonGoogleLogIn />
            <Link to="/register">Registrovat</Link>
        </div>
        
    )
}

export default Login
