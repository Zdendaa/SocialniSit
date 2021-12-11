import React, { useContext, useRef } from 'react'
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';
import axios from 'axios';
import changePath from '../changePath';
import CropperImage from './CropperImage';
import { GlobalContext } from '../context/GlobalState';

const ChangeProfileImg = () => {
    const { user, changeProfileImg, backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    // odkaz na komponentu CropperImage
    const childRef = useRef(0);
    console.log(childRef)
    
    const getNewCroppedPicture = async (image) => {
        const newImgName = "users/" + user.username + "/" + image.name + "" + Math.floor( Date.now() / 1000 );
        // obrazek se ulozi do storage
        await uploadImg(image, newImgName).then(async() => {
            console.log('upload img succesfully');
            // stahnuti url obrazku
            const urlOfImg = await downloadUrlImg(newImgName);
            // vytvoreni noveho zaznamu v tabulce images
            await axios.post(changePath('/images/createNew'), {url: urlOfImg});
            // vyhledani naseho uzivatele a ulozeni nove url do zaznamu naseho uzivatele v tabulce users do setNewProfilePicture
            await axios.put(changePath('/users/setNewProfilePicture'), {id: user._id, imgUrl: urlOfImg});
            // zmena profiloveho obrazku v context
            changeProfileImg(urlOfImg);
            // zmena profiloveho obrazku v localStorage
            var userString = localStorage.getItem("user");
            var userObject = JSON.parse(userString);
            userObject.idOrUrlOfProfilePicture = urlOfImg;
            var newUserData = JSON.stringify(userObject);
            localStorage.setItem("user", newUserData);
        })
    }
    return (
        <div className="settingsChangeProfilePicture">
            <span>přidej novou profilovou fotku</span>
            <img src={user.idOrUrlOfProfilePicture} alt="" referrerPolicy="no-referrer" style={{width: "120px", height: "120px"}}/>
            <CropperImage getNewCroppedPicture={getNewCroppedPicture} aspect={5/5} rect={false} ref={childRef} />
            <button onClick={() => childRef.current.getCroppedImg()} className="inputImgAddPost opacity" style={{backgroundColor: backgroundColor1, color: backgroundColor4}} >změnit profilovou fotku</button>
        </div>
    )
}

export default ChangeProfileImg
