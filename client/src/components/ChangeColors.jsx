import React, { useContext, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import ColorsPicker from './ColorsPicker';
import axios from 'axios';
import changePath from '../changePath';
import ClipLoader from "react-spinners/ClipLoader";
import { GoCheck } from 'react-icons/go';

const ChangeColors = () => {
    const {user, setColors, backgroundColor1, backgroundColor2, backgroundColor3, backgroundColor4} = useContext(GlobalContext);


    // promenne pro barvy 
    const [color1, setColor1] = useState(backgroundColor1);
    const [color2, setColor2] = useState(backgroundColor2);
    const [color3, setColor3] = useState(backgroundColor3);
    const [color4, setColor4] = useState(backgroundColor4);

    const [isLoading, setIsLoading] = useState(false);
    const [noError, setNoError] = useState(false);

    const [isLoadingDefaultButton, setIsLoadingDefaultButton] = useState(false);
    const [noErrorDefaultButton, setNoErrorDefaultButton] = useState(false);

    const changeColors = async () => {
        setIsLoading(true);
        // zjisteni zda existuje zaznam v tabulce userColors naseho uzivatele
        const userColors = await axios.get(changePath(`/userColors/ifUserColorsExist/${user._id}`));
        if(userColors.data) {
            // jetli ano tak jen atkualizujeme zaznam
            await axios.put(changePath(`/userColors/updateUserColors`), {idOfUser: user._id, backgroundColor1: color1, backgroundColor2: color2, backgroundColor3: color3, backgroundColor4: color4});
        } else {
            // jetli ne tak vyvtorime novy zaznam
            await axios.post(changePath(`/userColors/createUserColors`), {idOfUser: user._id, backgroundColor1: color1, backgroundColor2: color2, backgroundColor3: color3, backgroundColor4: color4});
        }
        // ulozime zaznam do localStorage
        localStorage.setItem("colors", JSON.stringify({backgroundColor1: color1, backgroundColor2: color2, backgroundColor3: color3, backgroundColor4: color4}));
        // ulozime zaznam do context api
        setColors({backgroundColor1: color1, backgroundColor2: color2, backgroundColor3: color3, backgroundColor4: color4});
        setIsLoading(false);
        setNoError(true);
    }

    // vraceni zakladnich barev
    const changeToDefault = async () => {
        setIsLoadingDefaultButton(true);
        // odstraneni colors z localStorage
        localStorage.removeItem("colors");
        // ulozeni zakladnich barev do context api
        setColors({backgroundColor1: "#D88100", backgroundColor2: "#F4F4F4", backgroundColor3: "black", backgroundColor4: "#ffffff"});

        // zjisteni zda existuje zaznam v tabulce userColors naseho uzivatele
        const userColors = await axios.get(changePath(`/userColors/ifUserColorsExist/${user._id}`));
        userColors.data && await axios.delete(changePath(`/userColors/deleteUserColors/${user._id}`)); // vymazani zaznamu v tabulce userColors
        setIsLoadingDefaultButton(false);
        setNoErrorDefaultButton(true);
        updateValueOfColors();
    }

    const updateValueOfColors = () => {
        setColor1("#D88100");
        setColor2("#F4F4F4");
        setColor3("black");
        setColor4("#ffffff");
    }
    return (
        <div className="ChangeColors">
            <hr className="lineNewPost" style={{backgroundColor: backgroundColor1, width: "100%"}}/>
            <h3 style={{color: backgroundColor1}}>Uprav barvy tvé sociální sítě</h3>
            <ColorsPicker setNoError={setNoError} setNoErrorDefaultButton={setNoErrorDefaultButton} text="Hlavní barva" color={color1} setColor={setColor1} />
            <ColorsPicker setNoError={setNoError} setNoErrorDefaultButton={setNoErrorDefaultButton} text="Sekundární barva" color={color2} setColor={setColor2} />
            <ColorsPicker setNoError={setNoError} setNoErrorDefaultButton={setNoErrorDefaultButton} text="barva pro halvní text" color={color3} setColor={setColor3} />
            <ColorsPicker setNoError={setNoError} setNoErrorDefaultButton={setNoErrorDefaultButton} text="barva pro sekundární text" color={color4} setColor={setColor4} />
            <button onClick={changeColors} className="inputImgAddPost opacity" style={{backgroundColor: backgroundColor1, color: backgroundColor4, margin: "15px 0px 0px 0px"}} >{!isLoading ? (noError ? <div className="correctAnimation"><GoCheck size={15} /></div> : "uložit nastavení") : <ClipLoader color={backgroundColor4} size={10}></ClipLoader>}</button>
            <span style={{marginTop: "15px", color: backgroundColor3}}>nebo</span>
            <button onClick={changeToDefault} className="inputImgAddPost opacity" style={{backgroundColor: backgroundColor1, color: backgroundColor4, margin: "15px 0px 0px 0px"}} >{!isLoadingDefaultButton ? (noErrorDefaultButton ? <div className="correctAnimation"><GoCheck size={15} /></div> : "vrátit do původního stavu") : <ClipLoader color={backgroundColor4} size={10}></ClipLoader>}</button>
        </div>
    )
}

export default ChangeColors
