import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { getUrlImgOrNull, uploadImg } from '../storageImgActions/imgFunctions';
import { TiDelete } from 'react-icons/ti';
import changePath from '../changePath';
import axios from 'axios';
import validator from 'validator';

const AddNewPost = () => {
    const {user, backgroundColor1} = useContext(GlobalContext);

    // promenna pro zobrazeni profilove fotky uzivatele
    const [url, setUrl] = useState(null);
   
    // useState promenna pro ulozeni a ukazani obrazku ktery uzivatel vybral
    const [image, setImage] = useState(null);

    // useState promenna pro ulozeni hodnoty co se vam honi hlavou
    const [desc, setDesc] = useState("");

    const [errorMessages, setErrorMessages] = useState(null);
    
    // hodnota inputu pro url obrazku
    const [valueUrlInput, setValueUrlInput] = useState("");


    useEffect(() => {
        // funkce ve ktere se ulozi do promenne url url obrazku nebo hodnota null
        const downloadUrl = async () => {
            // dostani url obrazku uzivatele
            setUrl(await getUrlImgOrNull(user));
        }
        downloadUrl();
    }, [user.idOrUrlOfProfilePicture, user.username, user]);

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
        // nacitani nastavime na true
        if (validation(desc)) {
            return;
        }
        // jestli uzivatel vybral obrazek tak se vytvori zaznam v tabulkce images
        const img = (image && (typeof image === "object")) ? await axios.post(changePath("/images/createNew"), {name: image.name}) : null;

        // jeslit obrzek existuje ulozeme ho do storage
        if (img) {
            // promenna cesta k souboru (obrazku)
            const newImgName = "posts/" + user.username + "/" + img.data._id;
            // obrazek se ulozi do storage
            await uploadImg(image, newImgName).then(async() => {
                console.log('upload img succesfully');

                await setDataOfPost(img.data);
                
            });
        } else {
            // jestli obrzek neexistuje tak posilame do funkce null
            await setDataOfPost(null);
        }
        // jeslit uzivatel zadal jenom url nebo jenom text v co se vam honi hlavou
    }

    // funkce pro vytvoeni ulozeni prispevku do databaze
    const setDataOfPost = async (img) => {
        try {
            // vytvoreni promenne ve ktere budou data prispevku
            const newPost = { 
                userId: user._id, 
                desc: desc, 
                urlOfImg: validator.isURL(valueUrlInput) ? image : null,
                idOfImg: img ? img._id : null,
            }
            // kdyz vse probehne v poradku tak se vytvori samotny prispevek v databazi prispevku
            axios.post(changePath("/posts/addPost"), newPost);
            console.log("pohoda");
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }
    
    return (
        <div className="addNewPost">
            <div className="addNewPostContainer">
                <div className="topAddNewPost">
                    <img className="profilePicture" src={user.idOrUrlOfProfilePicture ? url : "img/anonymous.png"} alt="" />
                    <input type="text" value={desc} onChange={(e) => validation(e.target.value)} className="inputAddNewPost" placeholder="co se vám honí hlavou..."/>
                </div>
                {errorMessages && <div className="bottomAddNewPost"><span className="errorMessage">{errorMessages}</span></div> }
                {image && 
                
                        <div className="imgShowContainerAddPost">
                            <img src={typeof image === "object" ? (URL.createObjectURL(image).toString().search('blob:') === 0 && URL.createObjectURL(image)) : (validator.isURL(image) && image) } alt="obrázek nelze najít" className="imgShowAddPost"/>
                            <TiDelete className="removeImgShow" onClick={(e) => {setImage(null)}} />
                        </div>
                        
                }
                <hr className="lineNewPost" style={{backgroundColor: backgroundColor1, width: "100%"}}/>
                <div className="middleAddNewPost">
                    <label htmlFor="fileUpload" id="inputfileRegister" className="inputImgAddPost" style={{backgroundColor: backgroundColor1, color: "white" }} >
                        <span>obrázek</span>
                    </label>
                    <input id="fileUpload" key={image || ''} type="file" accept="image/*" onChange={(e) => { setImage(e.target.files[0]); setValueUrlInput("") }} required/>
                    
                    <span>nebo</span>
                    <input type="text" value={valueUrlInput} onChange={(e) => { setImage(e.target.value); setValueUrlInput(e.target.value) }} className="inputAddNewPost inputUlrImgAddNewPost"  style={{backgroundColor: "black", color: "white" }} placeholder="url obrázku..."/>
                </div>
                <hr className="lineNewPost" style={{backgroundColor: backgroundColor1, width: "75%"}}/>
                <div className="bottomAddNewPost">
                    <button style={{backgroundColor: backgroundColor1, color: "white"}} className="inputImgAddPost" onClick={createPost}><span>přídat příspěvek</span></button>
                </div>
            </div>
        </div>
    )
}

export default AddNewPost
