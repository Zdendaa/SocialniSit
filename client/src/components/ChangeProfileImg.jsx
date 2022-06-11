import React, { useContext, useState } from 'react'
import CropperImage from './global/CropperImage';
import { GlobalContext } from '../context/GlobalState';
import axios from 'axios';
import changePath from '../changePath';
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';

const ChangeProfileImg = () => {
    const { user, backgroundColor1, changeProfileImg } = useContext(GlobalContext);

    const [error, setError] = useState(null)

    const getNewCroppedPicture = async (image, setNoError, setIsLoading, friends, sendNotification) => {
        setIsLoading(true);
        console.log(friends);
        const newImgName = "users/" + user.username + "/" + image.name + "" + Math.floor(Date.now() / 1000);

        if (((image?.size / 1024) / 1024).toFixed(4) > 5) {
            setError("soubor je větší než 5MB");
            return;
        }
        setError(null);
        // obrazek se ulozi do storage
        await uploadImg(image, newImgName).then(async () => {
            console.log('upload img succesfully');
            // stahnuti url obrazku
            const urlOfImg = await downloadUrlImg(newImgName);

            await addNewPhoto(urlOfImg, friends, sendNotification);
            // jestlize pridavame profilovou fotku
            if (user.idOrUrlOfProfilePicture) {
                // vyhledani stareho obrazku pomoci jeho url 
                const oldPhoto = await axios.post(changePath('/images/getImgByUrl'), { url: user.idOrUrlOfProfilePicture });
                // id nahrazeneho obrazku je ulozeno do 
                await axios.put(changePath("/users/addPhoto"), { id: user._id, idOfImg: oldPhoto.data._id });
            }


            // vyhledani naseho uzivatele a ulozeni nove url do zaznamu naseho uzivatele v tabulce users do setNewProfilePicture
            await axios.put(changePath('/users/setNewProfilePicture'), { id: user._id, imgUrl: urlOfImg });
            // zmena profiloveho obrazku v context
            changeProfileImg(urlOfImg);
            // zmena profiloveho obrazku v localStorage
            const userString = localStorage.getItem("user");
            const userObject = JSON.parse(userString);
            userObject.idOrUrlOfProfilePicture = urlOfImg;
            const newUserData = JSON.stringify(userObject);
            localStorage.setItem("user", newUserData);
            setIsLoading(false);
            setNoError(true);
        })
    }

    // funkce pro vytvoeni ulozeni prispevku do databaze
    const addNewPhoto = async (img, friends, sendNotification) => {
        try {
            // vytvoreni promenne ve ktere budou data prispevku
            const newPost = {
                userId: user._id,
                urlOfImg: img,
                newPicture: true,
            }
            // kdyz vse probehne v poradku tak se vytvori samotny prispevek v databazi prispevku
            const dataOfNewPost = await axios.post(changePath("/posts/addPost"), newPost);

            // vytvoreni noveho zaznamu v tabulce images
            await axios.post(changePath('/images/createNew'), { url: img, idOfPost: dataOfNewPost.data._id });

            // vsem nasim pratelum posleme notifikaci
            friends.forEach(async (friend, index) => {
                await sendNotification(friend._id, 6, null, dataOfNewPost.data._id, "přidal/a novou fotku");
            })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="settingsChangeProfilePicture">
            <h3 style={{ color: backgroundColor1 }}>Přidej novou profilovou fotku</h3>
            <img src={user.idOrUrlOfProfilePicture ? user.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="" referrerPolicy="no-referrer" style={{ width: "120px", height: "120px", borderRadius: "50%" }} />
            <CropperImage aspect={5 / 5} rect={false} saveImg={getNewCroppedPicture} />
            {error && <h4>{error}</h4>}
        </div>
    )
}

export default ChangeProfileImg
