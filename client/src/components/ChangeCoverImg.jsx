import React, { useContext } from 'react';
import CropperImage from './global/CropperImage';
import { GlobalContext } from '../context/GlobalState';
import changePath from '../changePath';
import axios from 'axios';
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';

const ChangeCoverImg = () => {
    const { user, socket, backgroundColor1, changeCoverImg} = useContext(GlobalContext);

    const getNewCroppedPicture = async (image, setNoError, setIsLoading, friends, sendNotification) => {
        setIsLoading(true);
        console.log(friends);
        const newImgName = "users/" + user.username + "/" + image.name + "" + Math.floor( Date.now() / 1000 );
        // obrazek se ulozi do storage
        await uploadImg(image, newImgName).then(async() => {
            console.log('upload img succesfully');
            // stahnuti url obrazku
            const urlOfImg = await downloadUrlImg(newImgName);

            await addNewPhoto(urlOfImg, friends, sendNotification);
            // jestlize pridavame fotku na pozadi
            if(user.idOrUrlOfCoverPicture) {
                // vyhledani stareho obrazku pomoci jeho url 
                const oldPhoto = await axios.post(changePath(`/images/getImgByUrl`), {url: user.idOrUrlOfCoverPicture});
                // id nahrazeneho obrazku je ulozeno do 
                await axios.put(changePath("/users/addPhoto"), {id: user._id, idOfImg: oldPhoto.data._id});
            }
            // vyhledani naseho uzivatele a ulozeni nove url do zaznamu naseho uzivatele v tabulce users do setNewProfilePicture
            await axios.put(changePath('/users/setNewCoverPicture'), {id: user._id, imgUrl: urlOfImg});
            // zmena obrazku na pozadi v context
            changeCoverImg(urlOfImg);
            // zmena obrazku na pozadi v localStorage
            const userString = localStorage.getItem("user");
            const userObject = JSON.parse(userString);
            userObject.idOrUrlOfCoverPicture = urlOfImg;
            const newUserData = JSON.stringify(userObject);
            localStorage.setItem("user", newUserData);
            setNoError(true);
            setIsLoading(false);
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
            await axios.post(changePath('/images/createNew'), {url: img, idOfPost: dataOfNewPost.data._id});
            
            // vsem nasim pratelum posleme notifikaci
            friends.forEach(async(friend, index) => {
                await sendNotification(friend._id, 6, null, dataOfNewPost.data._id, "přidal/a novou fotku");
            })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <hr className="lineNewPost" style={{backgroundColor: backgroundColor1, width: "100%"}}/>
            
            <div className="settingsChangeCoverPicture">
                <h3 style={{color: backgroundColor1}}>Přidej novou fotku na pozadí</h3>
                <img src={user.idOrUrlOfCoverPicture} alt="" referrerPolicy="no-referrer" style={{width: "80%", height: "auto"}}/>
                <CropperImage aspect={15/2} rect={true} socket={socket} saveImg={getNewCroppedPicture}/>
            </div>
        </>
    )
}

export default ChangeCoverImg

