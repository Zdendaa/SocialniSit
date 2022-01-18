import React, { useContext, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';
import { TiDelete } from 'react-icons/ti';
import changePath from '../changePath';
import axios from 'axios';
import validator from 'validator';
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

const AddNewPost = ({ socket, friends }) => {
    const {user, backgroundColor1, backgroundColor2, backgroundColor4} = useContext(GlobalContext);
   
    // useState promenna pro ulozeni a ukazani obrazku ktery uzivatel vybral
    const [image, setImage] = useState(null);

    // useState promenna pro ulozeni hodnoty co se vam honi hlavou
    const [desc, setDesc] = useState("");

    const [errorMessages, setErrorMessages] = useState(null);
    
    // hodnota inputu pro url obrazku
    const [valueUrlInput, setValueUrlInput] = useState("");

    // loading
    const [loading, setLoading] = useState(false);

    // funkce 

    const validation = (val) => {
        setDesc(val);
        if (val) {
            setErrorMessages(null);
            return false;
        } else {
            setErrorMessages("toto pole je povinné");
            return true;
        }
    }

    const createPost = async () => {
        // zjistime jestli pole co se vam honi hlavou neni prazdne
        if (validation(desc)) {
            return;
        }
        // nacitani nastavime na true
        setLoading(true)

        // jestli uzivatel vybral obrazek tak se vytvori zaznam v tabulkce images
        const img = (image && (typeof image === "object")) ? image : null;

        // jeslit obrzek existuje ulozeme ho do storage
        if (img) {
            // promenna cesta k souboru (obrazku)
            const newImgName = "posts/" + user.username + "/" + img.name + "" + Math.floor( Date.now() / 1000 );
            // obrazek se ulozi do storage
            await uploadImg(image, newImgName).then(async() => {
                console.log('upload img succesfully');
                const urlOfImg = await downloadUrlImg(newImgName);
                await setDataOfPost(urlOfImg);
                
            });
        } else {
            // jestli obrzek neexistuje tak posilame do funkce null
            await setDataOfPost(null);
        }
    }

    // funkce pro vytvoeni ulozeni prispevku do databaze
    const setDataOfPost = async (img) => {
        try {
            // vytvoreni promenne ve ktere budou data prispevku
            const newPost = { 
                userId: user._id, 
                desc: desc, 
                urlOfImg: validator.isURL(valueUrlInput) ? image : (img ? img : null)
            }
            // kdyz vse probehne v poradku tak se vytvori samotny prispevek v databazi prispevku
            const dataOfNewPost = await axios.post(changePath("/posts/addPost"), newPost);
            
            // vsem nasim pratelum posleme notifikaci
            friends.forEach(async(friend, index) => {
                await sendNotification(
                            friend._id, 
                            5, 
                            null, 
                            dataOfNewPost.data._id, 
                            "přidal/a nový příspěvek"
                        );
                if(friends.length - 1 === index) window.location.reload();
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
    
    return (
        <div className="addNewPost">
            <div className="addNewPostContainer">
                <div className="topAddNewPost">
                    <Link to={`/profile/${user._id}`} style={{display: 'flex', alignItems: "center"}}>
                    <img className="profilePicture" src={user.idOrUrlOfProfilePicture ? user.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="" referrerPolicy="no-referrer"/>
                    </Link>
                    <input type="text" value={desc} onChange={(e) => validation(e.target.value)} className="inputAddNewPost" placeholder="co se vám honí hlavou..."/>
                </div>
                {errorMessages && <div className="bottomAddNewPost"><span className="errorMessage">{errorMessages}</span></div> }
                {image && 
                
                        <div className="imgShowContainerAddPost">
                            <img src={typeof image === "object" ? (URL.createObjectURL(image).toString().search('blob:') === 0 && URL.createObjectURL(image)) : (validator.isURL(image) && image) } alt="obrázek nelze najít" className="imgShowAddPost" referrerPolicy="no-referrer"/>
                            <TiDelete className="removeImgShow scaled" onClick={(e) => {setImage(null)}} />
                        </div>
                        
                }
                <hr className="lineNewPost" style={{backgroundColor: backgroundColor1, width: "100%"}}/>
                <div className="middleAddNewPost">
                    <label htmlFor="fileUpload" id="inputfileRegister" className="inputImgAddPost opacity" style={{backgroundColor: backgroundColor1, color: "white" }} >
                        <span style={{color: backgroundColor4}}>obrázek</span>
                    </label>
                    <input id="fileUpload" key={image || ''} type="file" accept="image/*" onChange={(e) => { setImage(e.target.files[0]); setValueUrlInput("") }} required/>
                    
                    <span>nebo</span>
                    <input type="text" value={valueUrlInput} onChange={(e) => { setImage(e.target.value); setValueUrlInput(e.target.value) }} className="inputAddNewPost inputUlrImgAddNewPost"  style={{backgroundColor: "black", color: "white" }} placeholder="url obrázku..."/>
                </div>
                <hr className="lineNewPost" style={{backgroundColor: backgroundColor1, width: "75%"}}/>
                <div className="bottomAddNewPost">
                    <button style={{backgroundColor: backgroundColor1, color: backgroundColor4}} className="inputImgAddPost opacity" onClick={createPost}><span> {!loading ? "přídat příspěvek" : <ClipLoader color={backgroundColor2} size={10} />} </span></button>
                </div>
            </div>
        </div>
    )
}

export default AddNewPost
