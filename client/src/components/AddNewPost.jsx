import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { getUrlImgOrNull, uploadImg } from '../storageImgActions/imgFunctions';
import { TiDelete } from 'react-icons/ti';
import changePath from '../changePath';
import axios from 'axios';

const AddNewPost = () => {
    const {user, backgroundColor1} = useContext(GlobalContext);

    // promenna pro zobrazeni profilove fotky uzivatele
    const [url, setUrl] = useState(null);
   
    // useState promenna pro ulozeni a ukazani obrazku ktery uzivatel vybral
    const [image, setImage] = useState(null);

    useEffect(() => {
        // funkce ve ktere se ulozi do promenne url url obrazku nebo hodnota null
        const downloadUrl = async () => {
            // dostani url obrazku uzivatele
            setUrl(await getUrlImgOrNull(user));
        }
        downloadUrl();
    }, [user.idOrUrlOfProfilePicture, user.username, user]);

    // funkce 

    const createPost = async () => {
        console.log("aho");
        // nacitani nastavime na true

        // jestli uzivatel vybral obrazek tak se vytvori zaznam v tabulkce images
        const img = image ? await axios.post(changePath("/images/createNew"), {name: image.name}) : null;
        
        // jestli existuje img ulozi se img do storage
        if(img) {
            const newImgName = "posts/" + user.username + "/" + img.data._id;
            // obrazek se ulozi do storage
            await uploadImg(image, newImgName).then(async() => {
               console.log('upload img succesfully');
               // kdyz vse probehne v poradku tak se vytvori samotny prispevek v databazi prispevku
               axios.post(changePath("/posts/addPost"), { userId: user._id, desc: "ahoj", idOfImg: img.data._id })
            });
        } else {
            console.log("error");
        }
    }
    
    return (
        <div className="addNewPost">
            <div className="topAddNewPost">
                <img className="profilePicture" src={user.idOrUrlOfProfilePicture ? url : "img/anonymous.png"} alt="" />
                <input type="text" placeholder="co se vám honí hlavou..."/>
            </div>
            <br />
            <div className="middleAddNewPost">
                <label htmlFor="fileUpload" id="inputfileRegister" className="inputImgAddPost" style={{backgroundColor: backgroundColor1, color: "white" }} >
                    <span>obrázek</span>
                </label>
                <input id="fileUpload" key={image || ''} type="file" onChange={(e) => setImage(e.target.files[0])} required/>
                {image && 
                    <div className="imgShowContainer">
                        <img src={URL.createObjectURL(image)} alt="img" className="imgShow"/>
                        <TiDelete className="removeImgShow" onClick={(e) => {setImage(null)}} />
                    </div>
                }
                <span>nebo</span>
                <input type="text" placeholder="url obrázku"/>
            </div>
            <div className="bottomAddNewPost">
                <button style={{backgroundColor: backgroundColor1, color: "white"}} className="inputImgAddPost" onClick={createPost}><span>přídat příspěvek</span></button>
            </div>
        </div>
    )
}

export default AddNewPost
