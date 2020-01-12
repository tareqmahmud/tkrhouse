import React, {Component} from 'react';

class AudioVisualizer extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    draw() {
        const {audioData} = this.props;
        const canvas = this.canvas.current;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');
        let x = 0;
        const sliceWidth = (width * 1.0) / audioData.length; // the amount we will move to the right every time we draw
        context.lineWidth = 2;
        context.strokeStyle = '#161743';
        context.clearRect(0, 0, width, height); // clear previous drawings from the canvas.
        context.beginPath(); // begin the path we are going to draw and move the drawing position to halfway down the left side of the canvas.
        context.moveTo(0, height / 2);
        for (const item of audioData) {
            const y = (item / 255.0) * height; // Each data point is between 0 and 255.
            context.lineTo(x, y);
            x += sliceWidth;
        }
        //  draw a line to the point halfway down the right side of the canvas and direct the canvas to colour the entire path.
        context.lineTo(x, height / 2);
        context.stroke();
    }

    componentDidUpdate() {
        this.draw();
    }

    render() {
        return <canvas width="500" height="280" ref={this.canvas}/>;
    }
}

export default AudioVisualizer;