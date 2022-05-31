import axios from 'axios';
import EmojiPicker from './addMessageVariants/EmojiPicker';
import React, { useContext, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';
import CropperImage from './global/CropperImage'
import PopupWindown from './global/PopupWindown'
import { TiDelete } from 'react-icons/ti';

const AddStory = ({ setIsOpenAddStory }) => {

  const { user, backgroundColor1, backgroundColor2 } = useContext(GlobalContext);

  const [cropImg, setCropImg] = useState(null);
  const [video, setVideo] = useState(null);

  // promenne pro praci s textem na obrazku
  const [valueOfInput, setValueOfInput] = useState("");
  const [valueOfPlace, setValueOfPlace] = useState("mid");


  const getNewCroppedPicture = async (file, setNoError, setIsLoading, friends, sendNotification, type) => {
    setIsLoading(true);
    const newFileName = "stories/" + user.username + "/" + file.name + "" + Math.floor(Date.now() / 1000);
    // soubor se ulozi do storage
    await uploadImg(file, newFileName).then(async () => {
      console.log('upload file succesfully');
      // stahnuti url souboru
      const urlOfFile = await downloadUrlImg(newFileName);
      await addNewStory(urlOfFile, friends, sendNotification, type);
      setIsLoading(false);
      setNoError(true);
    })
  }
  // funkce pro vytvoeni ulozeni prispevku do databaze
  const addNewStory = async (file, friends, sendNotification, type) => {
    try {
      // vytvoreni promenne ve ktere budou data prispevku
      const newStory = {
        idOfUser: user._id,
        urlOfImg: type === 1 ? file : null,
        urlOfVideo: type === 2 ? file : null,
        text: valueOfInput,
        position: valueOfPlace,
      }
      // kdyz vse probehne v poradku tak se vytvori samotny prispevek v databazi prispevku
      const dataOfNewStory = await axios.post(changePath("/stories/addStory"), newStory);

      // vsem nasim pratelum posleme notifikaci
      new Promise(() => {
        friends.forEach(async (friend, index) => {
          await sendNotification(friend._id, 7, null, dataOfNewStory.data._id, "přidal/a nový příběh");
          if (index === friends.length - 1) { window.location.reload(); }
        })
      }
      );


    } catch (err) {
      console.log(err);
    }
  }

  return (
    <PopupWindown classNameMain="AddStory" classNameContainer="shareContainer" setVisible={setIsOpenAddStory}>
      <div className="mainContainerSettingsStory">
        <div className="settingsStory">
          <div className='inputEmojiPickerContainer'>
            <input type="text" className="inputInfo" style={{ backgroundColor: backgroundColor2, color: backgroundColor1 }} placeholder="něco k příběhu..." value={valueOfInput} onChange={(e) => { setValueOfInput(e.target.value) }} />
            <EmojiPicker setValOfText={setValueOfInput} />
          </div>
          <select onChange={(e) => { setValueOfPlace(e.target.value) }} className="inputInfo" style={{ backgroundColor: backgroundColor2, color: backgroundColor1 }} >
            <option value="top" >nahoře</option>
            <option value="mid" selected >upřostřed</option>
            <option value="bot" >dole</option>
          </select>
          {
            video && (
              <div className="imgShowContainerAddPost" style={{ position: "relative" }} >
                <span className={valueOfPlace}><span style={{ padding: "5px" }}>{valueOfInput}</span></span>
                <video className="videoShowAddStory" autoPlay loop>
                  <source src={URL.createObjectURL(video)} type='video/mp4' />
                </video>
                <TiDelete className="removeImgShow scaled" onClick={(e) => { setVideo(null) }} />
              </div>
            )
          }
          {cropImg &&
            <div style={{ position: "relative" }}>
              <img alt="" style={{ width: "120px", height: "200px" }} src={cropImg} />
              <TiDelete className="removeImgShow scaled" onClick={(e) => { setCropImg(null) }} />
              <span className={valueOfPlace}><span style={{ padding: "5px" }}>{valueOfInput}</span></span>
            </div>
          }
        </div>
        <div className="displayStory">
          <h4 style={{ color: backgroundColor1 }}>Vyber část na obrázku</h4>
          <CropperImage aspect={6 / 10} rect={true} addStory={true} saveImg={getNewCroppedPicture} valueOfPlace={valueOfPlace} setCropImg={setCropImg} setVideo={setVideo} video={video}>

          </CropperImage>
        </div>
      </div>
    </PopupWindown>
  )
}

export default AddStory