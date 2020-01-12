import React, {useState} from 'react';

const ThemeContext = React.createContext(null);

const ThemeProvider = (props) => {
    const [light_status, setLightStatus] = useState({
        light_status: false
    });

    const updateLightStatus = () => {
        console.log('Access');
        setLightStatus({
            light_status: !light_status.light_status
        })
    };

    return (
        <ThemeContext.Provider value={{...light_status, updateLightStatus, setLightStatus}}>
            {props.children}
        </ThemeContext.Provider>
    )
};

export default ThemeProvider;
export {ThemeContext};