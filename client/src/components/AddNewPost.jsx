import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';
import { TiDelete } from 'react-icons/ti';
import changePath from '../changePath';
import axios from 'axios';
import validator from 'validator';
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import EmojiPicker from './addMessageVariants/EmojiPicker';
import PhotoMessage from './addMessageVariants/PhotoMessage';
import VideoMessage from './addMessageVariants/VideoMessage';

const AddNewPost = ({ friends }) => {
    const { user, socket, backgroundColor1, backgroundColor2, backgroundColor4 } = useContext(GlobalContext);

    // objekt daneho souboru
    const [file, setFile] = useState(null);

    // jaky typ je url // 1 = img, 2 = video
    const [typeOfUrl, setTypeOfUrl] = useState(null);


    // useState promenna pro ulozeni hodnoty co se vam honi hlavou
    const [desc, setDesc] = useState("");

    const [errorMessages, setErrorMessages] = useState(null);

    // hodnota inputu pro url
    const [valueUrlInput, setValueUrlInput] = useState("");

    // loading
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        whatTypeIsFile(file?.name);
        console.log(file)
    }, [file])

    useEffect(() => {
        whatTypeIsFile(valueUrlInput);
    }, [valueUrlInput])
    

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

        // jestli uzivatel vybral soubor tak se vytvori zaznam v tabulkce urls
        const newFile = (file && (typeof file === "object")) ? file : null;

        // jeslit soubor existuje ulozeme ho do storage
        if (newFile) {
            // promenna cesta k souboru (obrazku)
            const newFileName = "posts/" + user.username + "/" + newFile.name + "" + Math.floor(Date.now() / 1000);
            // obrazek se ulozi do storage
            await uploadImg(newFile, newFileName).then(async () => {
                console.log('upload img succesfully');
                const urlOfFile = await downloadUrlImg(newFileName);
                await setDataOfPost(urlOfFile);
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
                urlOfImg: typeOfUrl === 1 && validator.isURL(valueUrlInput) ? valueUrlInput : (img ? img : null),
                urlOfVideo: typeOfUrl === 2 && validator.isURL(valueUrlInput) ? valueUrlInput : (img ? img : null)
            }
            // kdyz vse probehne v poradku tak se vytvori samotny prispevek v databazi prispevku
            const dataOfNewPost = await axios.post(changePath("/posts/addPost"), newPost);
            console.log(friends);
            // vsem nasim pratelum posleme notifikaci
            if (friends.length === 0) {
                window.location.reload();
            } else {
                friends.forEach(async (friend, index) => {
                    await sendNotification(
                        friend._id,
                        5,
                        null,
                        dataOfNewPost.data._id,
                        "přidal/a nový příspěvek"
                    );
                    console.log(index);
                    if (friends.length - 1 === index) window.location.reload();
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    const sendNotification = async (recieverId, type, url, idOfPost, text) => {
        // pridani notifikace do db
        const newNotificatons = await axios.post(changePath(`/notifications/addNotification`), { senderId: user._id, recieverId, type, url, idOfPost, text });
        // pridani notifikace do socket.io serveru
        socket.emit("sendNotification", { id: newNotificatons.data._id, senderId: user._id, recieverId, type, url, idOfPost, readed: false, text });
    }

    const whatTypeIsFile = (val) => { 
        const valLowerCase = val?.toLowerCase();
        if(valLowerCase?.includes("youtube") || valLowerCase?.includes("mp4") || valLowerCase?.includes("avi")) {
            setTypeOfUrl(2)
            // jestli uzivatel zadal url z youtube musime url upravit
            if(valLowerCase?.includes("youtube") && !valLowerCase?.includes("embed") ) {
                const id = val.split("v=");
                setValueUrlInput("https://www.youtube.com/embed/" + id[1]);
            } else {
                setValueUrlInput(val);
            }
            console.log(2)
        } else {
            setTypeOfUrl(1);
        }
    }

    return (
        <div className="addNewPost">
            <div className="addNewPostContainer">
                <div className="topAddNewPost">
                    <div className='topAddNewPostLeft'>
                        <Link to={`/profile/${user._id}`} style={{ display: 'flex', alignItems: "center" }}>
                            <img className="profilePicture" src={user.idOrUrlOfProfilePicture ? user.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="" referrerPolicy="no-referrer" />
                        </Link>
                        <input type="text" value={desc} onChange={(e) => validation(e.target.value)} className="inputAddNewPost" placeholder="co se vám honí hlavou..." />
                    </div>
                    <div className='inputEmojiPickerContainer postEmojiContainer'>

                        <EmojiPicker setValOfText={validation} />
                    </div>
                </div>
                {errorMessages && <div className="bottomAddNewPost"><span className="errorMessage">{errorMessages}</span></div>}
                {(file || valueUrlInput !== "") &&
                    (typeOfUrl === 1 
                    ? 
                    <div className="imgShowContainerAddPost">
                        <img src={file ? URL.createObjectURL(file) : (validator.isURL(valueUrlInput) && valueUrlInput)} alt="video/obrázek nelze najít" className="imgShowAddPost" referrerPolicy="no-referrer" />
                        <TiDelete className="removeImgShow scaled" onClick={(e) => { setFile(null); setValueUrlInput("") }} />
                       
                    </div>
                    :
                    <div className="imgShowContainerAddPost">
                        <iframe src={file ? URL.createObjectURL(file) : (validator.isURL(valueUrlInput) && valueUrlInput)} alt="video/obrázek nelze najít" className="videoShowAddPost" referrerPolicy="no-referrer" ></iframe>
                        <TiDelete className="removeImgShow scaled" onClick={(e) => { setFile(null); setValueUrlInput(""); }} />
                    </div>)
                }
                <hr className="lineNewPost" style={{ backgroundColor: backgroundColor1, width: "100%" }} />
                <div className="middleAddNewPost">
                    {/* <label htmlFor="fileUpload" id="inputfileRegister" className="inputImgAddPost opacity" style={{ backgroundColor: backgroundColor1, color: "white" }} >
                        <span style={{ color: backgroundColor4 }}>obrázek</span>
                    </label>  */}
                    <div className='actionsMethod'>
                        <PhotoMessage setPhotoFile={setFile} />
                        <VideoMessage setVideoFile={setFile}/>
                    </div>
                    {/* <input id="fileUpload" key={url || ''} type="file" accept="url/*" onChange={(e) => { setFile(e.target.files[0]); setValueUrlInput("") }} required /> */}

                    <span>nebo</span>
                    <input type="text" onChange={(e) => { setValueUrlInput(e.target.value) }} className="inputAddNewPost inputUlrImgAddNewPost" style={{ backgroundColor: "black", color: "white" }} placeholder="url obrázku / videa..." />
                </div>
                <hr className="lineNewPost" style={{ backgroundColor: backgroundColor1, width: "75%" }} />
                <div className="bottomAddNewPost">
                    <button style={{ backgroundColor: backgroundColor1, color: backgroundColor4 }} className="inputImgAddPost opacity" onClick={createPost}><span> {!loading ? "přídat příspěvek" : <ClipLoader color={backgroundColor2} size={10} />} </span></button>
                </div>
            </div>
        </div>
    )
}

export default AddNewPost
