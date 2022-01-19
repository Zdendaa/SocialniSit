import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';
import UploadControl from './UploadControl';
import ClipLoader from "react-spinners/ClipLoader";
import { GoCheck } from 'react-icons/go';

const CropperImage = ({ aspect, rect, socket }) => { 
    const { user, changeProfileImg, changeCoverImg, backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    const [crop, setCrop] = useState({ aspect });

    const [urlImage, setUrlImage] = useState(null);

    const [image, setImage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    // zda se nenastala zadna chyba
    const [noError, setNoError] = useState(false);

    const [friends, setFriends] = useState([]);
    
    useEffect(() => {
        const getFrinends = async () => {
            // nacteni pratel
            const users = await axios.get(`/users/getAllFriends/${user._id}`);
            setFriends(users.data);
        }
        getFrinends();
     }, [user._id])

    const getNewCroppedPicture = async (image) => {
        setIsLoading(true);
        const newImgName = "users/" + user.username + "/" + image.name + "" + Math.floor( Date.now() / 1000 );
        // obrazek se ulozi do storage
        await uploadImg(image, newImgName).then(async() => {
            console.log('upload img succesfully');
            // stahnuti url obrazku
            const urlOfImg = await downloadUrlImg(newImgName);

            await addNewPhoto(urlOfImg);
            
            if(rect) {
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
            } 
            else {
                // jestlize pridavame profilovou fotku
                if(user.idOrUrlOfProfilePicture) {
                    // vyhledani stareho obrazku pomoci jeho url 
                    const oldPhoto = await axios.post(changePath('/images/getImgByUrl'), {url: user.idOrUrlOfProfilePicture});
                    // id nahrazeneho obrazku je ulozeno do 
                    await axios.put(changePath("/users/addPhoto"), {id: user._id, idOfImg: oldPhoto.data._id});
                }
                

                // vyhledani naseho uzivatele a ulozeni nove url do zaznamu naseho uzivatele v tabulce users do setNewProfilePicture
                await axios.put(changePath('/users/setNewProfilePicture'), {id: user._id, imgUrl: urlOfImg});
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
            }
            
        })
    }

    // funkce pro vytvoeni ulozeni prispevku do databaze
    const addNewPhoto = async (img) => {
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

    const sendNotification = async (recieverId, type, url, idOfPost, text) => {
        // pridani notifikace do db
        const newNotificatons = await axios.post(changePath(`/notifications/addNotification`), {senderId: user._id, recieverId, type, url, idOfPost, text});
        // pridani notifikace do socket.io serveru
        socket.emit("sendNotification", {id: newNotificatons.data._id, senderId: user._id, recieverId, type, url, idOfPost, readed: false, text});
    }

    const getCroppedImg = async () => {    
        if (!image || (crop.width === 0 && crop.height === 0)) return;
        // vytvoreni canvasu
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        /*
        const base64Image = canvas.toDataURL("image/jpeg");
        setResult(base64Image);
        getNewCroppedPicture(base64Image);
        */
        canvas.toBlob(async (blob) => {
            blob.name = Math.floor( Date.now() / 1000 );
            setUrlImage(null);
            await getNewCroppedPicture(blob);
        });
    }

    return (
        <div className="CropperImage">
            <UploadControl setUrlImage={setUrlImage} setNoError={setNoError} id={rect ? "addCoverPicture" : "addProfilePicture"}>
                <span className="opacity" style={{color: backgroundColor4}}>vyber obrázek</span>
            </UploadControl>
            { 
                urlImage && (
                    <>
                        {
                            rect ? (
                                <ReactCrop src={urlImage}
                                    onImageLoaded={setImage}
                                    crop={crop}
                                    onChange={newCrop => setCrop(newCrop)}
                                    style={{ width: "80%", height: "auto" }}
                                />
                            ) :
                            (
                                <ReactCrop src={urlImage}
                                    onImageLoaded={setImage}
                                    crop={crop}
                                    onChange={newCrop => setCrop(newCrop)}
                                    style={{ width: "250px", height: "auto" }}
                                    circularCrop
                                />
                            )
                        }

                    </>
                )       
            }
            <button onClick={() => getCroppedImg()} className="inputImgAddPost opacity" style={{backgroundColor: backgroundColor1, color: backgroundColor4, margin: "15px 0px 0px 0px"}} >{!isLoading ? (noError ? <div className="correctAnimation"><GoCheck size={15} /></div> : (rect ? "změnit fotku na pozadí" : "změnit profilovou fotku") ) : <ClipLoader color={backgroundColor4} size={10}></ClipLoader>}</button>
        </div>

    )
}


export default CropperImage
