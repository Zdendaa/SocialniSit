import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router';
import { GlobalContext } from '../context/GlobalState'
import { uploadImg } from '../storageImgActions/imgFunctions'
import axios from 'axios'
import ButtonGoogleLogIn from '../components/ButtonGoogleLogIn';
import { Link } from 'react-router-dom'
import changePath from '../changePath';

const Register = () => {
    // vypujceni promenne user a funkce setUser z context api
    const {user, setUser} = useContext(GlobalContext);

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
            <input type="name" ref={name} placeholder="name" required/>
            <input type="password" ref={password} placeholder="password" required/>
            <input type="email" ref={email} placeholder="email" required/>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} required/>
            <button onClick={createUser}>Registrovat</button>
            <ButtonGoogleLogIn />
            <Link to="/login">Příhlásit se</Link>

            <p>{user && user.name}</p>
            <p>{user && user.password}</p>
        </div>
    )
}

export default Register
