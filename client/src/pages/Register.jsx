import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router';
import { GlobalContext } from '../context/GlobalState';
import storage from '../firebaseStorage/storage';
import { uploadImg } from '../storageImgActions/imgFunctions'

const Register = () => {

    const {user, setUser} = useContext(GlobalContext);
    // useRef promenne
    const name = useRef(null);
    const password = useRef(null);

    // useState promenne
    const [image, setImage] = useState(null);

    // useHistry ( pouziva se k presmerovani stranky)
    const history = useHistory();


    // funkce

    // vytvoreni uzivatele
    const createUser = () => {
        const newUser = {
            name: name.current.value,
            password: password.current.value
        }
        // ulozeni uzivatele do local storage aby uzivatel byl ulozeny i po refreshnuti stranky
        localStorage.setItem("user", JSON.stringify(newUser));
       
        // volani funkce v GlobalProvider a ulozeni uzivatele do initialState
        setUser(newUser);

        // ulozeni img do storage
        saveImgInStorages();

        history.push("/")
        
    }

    const saveImgInStorages = async () => {
        // ulozeni img do storage
        await uploadImg(image, storage);
    }


    return (
        <div className="Register">
            <input type="name" ref={name} required/>
            <input type="password" ref={password} required/>
            <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
            <button onClick={createUser}>Registrovat</button>

            <p>{user && user.name}</p>
            <p>{user && user.password}</p>
        </div>
    )
}

export default Register
