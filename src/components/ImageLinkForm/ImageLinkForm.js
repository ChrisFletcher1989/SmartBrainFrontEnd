import React from "react";
import './ImageLinkForm.css'
//The input form (for picture url)

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        
        <div>
            <p className="f3 reactive">
                {'This Smart Brain will detect faces in your pictures, and tell you which celebrity it is. Give it a try.'}<br />
                {'スマートブレインはAI使用で写真内の顔を検出して、セレブリティ内　"だれ"　か教えることします。やってみない？'}
            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' 
                    onClick={onButtonSubmit}>Detect</button>
                    </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;