import React, { useContext, useState } from 'react'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import { GlobalContext } from '../../context/GlobalState';
import { MdKeyboardVoice } from 'react-icons/md';

const VoiceMessage = ({ setUrlOfVoice }) => {
    const { backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    const [recordState, setRecordState] = useState();

    const start = () => {
        setRecordState(RecordState.START);
    }
    const stop = () => {
        setRecordState(RecordState.STOP);
    }
    const onStop = async (audioData) => {
        console.log(audioData);
        setUrlOfVoice(audioData);
    }

    return (
        <div className='VoiceMessage'>
            <AudioReactRecorder state={recordState} onStop={onStop} className="audioRecorder" />
            {recordState == "start" ? <button className='buttonsForVariantsMessage' style={{ color: backgroundColor4, backgroundColor: backgroundColor1 }} onClick={stop}>stop</button> : <button className='buttonsForVariantsMessage' style={{ color: backgroundColor4, backgroundColor: backgroundColor1 }} onClick={start}><MdKeyboardVoice /></button>}
        </div >
    )
}

export default VoiceMessage