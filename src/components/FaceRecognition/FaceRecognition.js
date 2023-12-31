import React from "react";
import './FaceRecognition.css';
//Facial recognition box
const FaceRecognition = ({ imageUrl, box }) => {
    return (
       <div className="center ma">
       <div className="absolute mt6">
       <img id="inputImage" alt="" src={imageUrl} width='500px' height='auto'/>
       <div className='bounding_box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}></div>
       </div>
       </div>
    );
}

export default FaceRecognition;