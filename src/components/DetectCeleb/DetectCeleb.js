import React from "react";
import './DetectCeleb.css';


const DetectCeleb = ({ box2 }) => {
    return (
       <div className="center ma">
       <div className="absolute mt2">
       <p className='celeb'value={box2}> {box2.celebrity} </p>
       <p className='accuracy'value={box2}> {box2.Accuracy} </p>

       </div>
       </div>
    );
}

export default DetectCeleb;