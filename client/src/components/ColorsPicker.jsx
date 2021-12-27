import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState';

const ColorsPicker = ({ text, color, setColor, setNoError, setNoErrorDefaultButton }) => {
    const { backgroundColor1, backgroundColor3 } = useContext(GlobalContext);
    return (
        <div className="ColorsPicker">
            <span style={{ color: backgroundColor3 }}>{text}</span>
            <input type="color" className="pointer" style={{ backgroundColor: backgroundColor1, borderRadius: "5px" }} value={color} onChange={ ( e ) => { setColor(e.target.value); setNoError(false); setNoErrorDefaultButton(false) } } />
        </div>
    )
}

export default ColorsPicker
