import React, { useContext, useRef } from 'react'
import { GlobalContext } from '../context/GlobalState';

const Register = () => {

    const {user, setUser} = useContext(GlobalContext);

    const name = useRef(null);
    const password = useRef(null);

    // funkce
    const createUser = () => {
        const newUser = {
            name: name.current.value,
            password: password.current.value
        }
        setUser(newUser);
    }
    return (
        <div className="Register">
            <input type="name" ref={name} required/>
            <input type="password" ref={password} required/>
            <input type="file" />
            <button onClick={createUser}>Registrovat</button>

            <p>{user && user.name}</p>
            <p>{user && user.password}</p>
        </div>
    )
}

export default Register
