import React, { useContext, useRef } from 'react'
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';
import axios from 'axios';
import changePath from '../changePath';
import CropperImage from './CropperImage';
import { GlobalContext } from '../context/GlobalState';

const ChangeCoverImg = () => {
    const { user, changeCoverImg, backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    // odkaz na komponentu CropperImage
    const childRef = useRef(5);
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
            await axios.put(changePath('/users/setNewCoverPicture'), {id: user._id, imgUrl: urlOfImg});
            // zmena obrazku na pozadi v context
            changeCoverImg(urlOfImg);
            // zmena profiloveho obrazku v localStorage
            var userString = localStorage.getItem("user");
            var userObject = JSON.parse(userString);
            userObject.idOrUrlOfCoverPicture = urlOfImg;
            var newUserData = JSON.stringify(userObject);
            localStorage.setItem("user", newUserData);
        })
    }
    return (
        <div className="settingsChangeCoverPicture">
            <span>přidej novou fotku na pozadí</span>
            <img src={user.idOrUrlOfCoverPicture} alt="" referrerPolicy="no-referrer" style={{width: "120px", height: "120px"}}/>
            <CropperImage getNewCroppedPicture={getNewCroppedPicture} aspect={7/5} rect={true} ref={childRef} />
            <button onClick={() => childRef.current.getCroppedImg()} className="inputImgAddPost opacity" style={{backgroundColor: backgroundColor1, color: backgroundColor4}} >změnit fotku na pozadí</button>
        </div>
    )
}

export default ChangeCoverImg
