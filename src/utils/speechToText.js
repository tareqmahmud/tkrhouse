const matchLightActionFromVoice = (voice) => {
    let lightOn = voice.match(/hi|hey|google|gooooogle|turn|turnnnn|on|onnn|light|lights|ligh|liggght/gmi);
    let lightOff = voice.match(/hi|hey|google|gooooogle|turn|turnnnn|off|of|offfff|light|lights|ligh|liggght/gmi);

    if (lightOn === null || lightOff === null){
        return null;
    }

    if (lightOn.length >= 5) {
        return true;
    } else if (lightOff.length >= 5) {
        return false;
    }

    return null;
};

export {matchLightActionFromVoice};