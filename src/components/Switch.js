import React from 'react';
import {ThemeContext} from '../context/ThemeContext';
import './Switch.css';
import firebase from "../base";

class Switch extends React.Component{
    static contextType = ThemeContext;

    updateLightStatus = () => {
        firebase.firestore().collection('LEDStatus').doc('rycUkHyKsUl0NnS0Ocxi').update({
            'light_status': !this.context.light_status
        });
    };

    componentDidMount() {
        firebase.firestore().collection('LEDStatus').doc('rycUkHyKsUl0NnS0Ocxi').onSnapshot(doc => {
            if (doc.exists){
                this.context.setLightStatus({
                    light_status: doc.data().light_status
                })
            }
        })
    }

    render() {
        const context = this.context;
        return (
            <div className="col-md-12 mt-5">
                <label>
                    <input type="checkbox"
                           checked={context.light_status}
                           onChange={this.updateLightStatus}/>
                    <span className="check"/>
                    <span className="light off">Off</span>
                    <span className="light on">On</span>
                </label>
            </div>
        )
    }
}

export default Switch;