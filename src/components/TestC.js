import React, {useEffect} from "react";
import firebase from "firebase";

class TestC extends React.Component{
    componentDidMount() {
        firebase.firestore().collection('LEDStatus').onSnapshot(snapshot => {
            console.log(snapshot);
        })
    }

    render() {
        return (
            <h2>OK</h2>
        )
    }
}

export default TestC;