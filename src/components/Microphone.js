import React from 'react';
import './Microphone.css';
import MicrophoneOff from '../images/MicrophoneOff.svg';
import MicrophoneOn from '../images/MicrophoneOn.svg';

const Microphone = (props) => {
    return (
        <div className="google-microphone" onClick={props.toggleMicrophone}>
            {props.audio ? <img src={MicrophoneOn} alt="Microphone On" />
                : <img src={MicrophoneOff} alt="Microphone Off" onClick={props.startListening}/>}
        </div>
    )
};

export default Microphone;