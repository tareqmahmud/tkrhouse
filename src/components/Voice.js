import React from 'react';
import {matchLightActionFromVoice} from '../utils/speechToText'

const Voice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript);

        if (e.results[0].isFinal) {
            let lightStatus = matchLightActionFromVoice(transcript[0]);
            console.log(transcript);
            if (lightStatus === true) {
                console.log('Light On');
            } else if (lightStatus === false) {
                console.log('Light Off');
            }
        }
    });

    recognition.addEventListener('end', recognition.start);

    const microphoneOn = () => {
        recognition.start();
    };

    const microphoneOff = () => {
        recognition.abort();
        recognition.addEventListener('end', recognition.abort);
    };

    return null;
};

export default Voice;