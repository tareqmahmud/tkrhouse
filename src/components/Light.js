import React, {useContext} from 'react';
import {ThemeContext} from '../context/ThemeContext';
import LightOn from '../images/light_on.svg';
import LightOff from '../images/light_off.svg';

const Light = (props) => {
    const context = useContext(ThemeContext);
    const light_status = context.light_status;

    return (
        <div className="col-md-12">
            {light_status ? <img src={LightOn} alt="Light On"/>
                : <img src={LightOff} alt="Light Off"/>}
        </div>
    )
};

export default Light;