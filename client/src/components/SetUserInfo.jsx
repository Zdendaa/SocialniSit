import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import ClipLoader from "react-spinners/ClipLoader";
import { GoCheck } from 'react-icons/go';

const SetUserInfo = () => {
    const { user, backgroundColor1, backgroundColor2, backgroundColor4 } = useContext(GlobalContext);

    const [ifLoading, setIfLoading] = useState(false);
    const [infoData, setInfoData] = useState([]);

    // zda se nenastala zadna chyba
    const [noError, setNoError] = useState(false);

    const desc = useRef();
    const from = useRef();
    const relationShip = useRef();

    useEffect(() => {
        const getInfo = async () => {
            const info = await axios.get(changePath(`/userinfos/getUserInfo/${user._id}`));
            setInfoData(info.data);
            console.log(info.data)
        }
        getInfo();
    }, [user._id]);
    const saveNewInfo = async () => {
        setIfLoading(true);
        const ifInfoExist = await axios.post(changePath("/userInfos/ifInfoExist"), {id: user._id});
        const dataInfo = {
            idOfUser: user._id, 
            desc: desc.current.value, 
            from: from.current.value, 
            relationShip: relationShip.current.value
        }

        if(ifInfoExist.data) {
            // aktulalizovani zaznamu userInfo
            await axios.put(changePath("/userInfos/updateInfo"), dataInfo).then(() => {
                setIfLoading(false);
                setNoError(true);
            });
        } else {
            // vytvoreni zaznamu userInfo
            console.log(dataInfo);
            await axios.post(changePath("/userInfos/createUserInfo"), dataInfo).then(() => {
                setIfLoading(false);
                setNoError(true);
            });
        }
    }

    const changeInput = () => {
        setInfoData(null);
        setNoError(false);
    }
    return (
        <>
            <hr className="lineNewPost" style={{backgroundColor: backgroundColor1, width: "100%"}}/>
            <div className="SetUserInfo">
                
                <h3 style={{color: backgroundColor1}}>Info</h3>
                <input type="text" className="inputInfo" style={{backgroundColor: backgroundColor2, color: backgroundColor1}} value={infoData && infoData.desc} onChange={changeInput} placeholder="popis..." ref={desc} />
                <input type="text" className="inputInfo" style={{backgroundColor: backgroundColor2, color: backgroundColor1}} value={infoData && infoData.from} onChange={changeInput} placeholder="býdlíte v..." ref={from} />
                <select className="inputInfo" style={{backgroundColor: backgroundColor2, color: backgroundColor1}} ref={relationShip} onChange={changeInput} value={infoData && infoData.relationShip}>
                    <option value="">-</option>
                    <option value="nezadaný/á">nezadaný/á</option>
                    <option value="zadaný/á">zadaný/á</option>
                    <option value="zasnoubený/á">zasnoubený/á</option>
                    <option value="ženatý/á">ženatý/á</option>
                    <option value="rozvedený/á">rozvedený/á</option>
                </select>
                <button className="buttonSetInfo opacity" onClick={saveNewInfo} style={{backgroundColor: backgroundColor1, color: backgroundColor4}}>{ifLoading ? <ClipLoader color={backgroundColor4} size={10}></ClipLoader> : noError ? <div className="correctAnimation"><GoCheck size={15} /></div> : "uložit nastavení"}</button>
            </div>
        </>
    )
}

export default SetUserInfo
