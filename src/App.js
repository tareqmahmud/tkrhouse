import React, {Component} from 'react';
import AudioAnalyzer from './components/AudioAnalyzer';
import Microphone from './components/Microphone';
import Light from './components/Light';
import Switch from './components/Switch';
import ThemeProvider from './context/ThemeContext';
import firebase from "./base";
import Voice from "./components/Voice";
import {matchLightActionFromVoice} from "./utils/speechToText";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audio: null
        };
        this.toggleMicrophone = this.toggleMicrophone.bind(this);
        this.startListening = this.startListening.bind(this);
        this.stopListening = this.stopListening.bind(this);
        this.recognition = null;
    }

    async getMicrophone() {
        const audio = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });
        this.setState({audio});
    }

    stopMicrophone() {
        this.state.audio.getTracks().forEach(track => track.stop());
        this.setState({audio: null});
    }

    stopListening() {
        const audioTranscript = document.getElementById("audioTranscript");
        audioTranscript.innerText = null;
    }

    toggleMicrophone() {
        this.state.audio ? this.stopMicrophone() : this.getMicrophone();
    }

    startListening() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript);
            const audioTranscript = document.getElementById("audioTranscript");
            audioTranscript.innerText = transcript[0];

            if (e.results[0].isFinal) {
                let lightStatus = matchLightActionFromVoice(transcript[0]);
                console.log(transcript[0]);

                if (lightStatus === true) {
                    firebase.firestore().collection('LEDStatus').doc('rycUkHyKsUl0NnS0Ocxi').update({
                        'light_status': true
                    });
                } else if (lightStatus === false) {
                    firebase.firestore().collection('LEDStatus').doc('rycUkHyKsUl0NnS0Ocxi').update({
                        'light_status': false
                    });
                }
            }
        });
        this.recognition.start();
        this.recognition.addEventListener('end', this.recognition.start);
    }

    render() {
        return (
            <ThemeProvider>
                <div className="container">
                    <div className="App row">
                        <div className="col-md-6 mt-4">
                            <div className="card text-center">
                                <div className="card-header">
                                    <h4>TKR Smart House</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <Light/>
                                        <Switch/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mt-4">
                            <div className="card">
                                <div className="card-header text-center">
                                    <h4>Voice Assistant</h4>
                                </div>
                                <div className="card-body">
                                    <div className="App">
                                        <Microphone audio={this.state.audio}
                                                    startListening={this.startListening}
                                                    toggleMicrophone={this.toggleMicrophone}
                                                    stopListening={this.stopListening}/>
                                        <h4 className="text-center mt-5" id="audioTranscript"/>
                                        {this.state.audio ? <AudioAnalyzer audio={this.state.audio}/> : ''}
                                    </div>

                                </div>
                                {this.state.audio && <div className="card-footer text-center">
                                    <h4>Listening....</h4>
                                </div>}
                            </div>
                        </div>

                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

export default App;
