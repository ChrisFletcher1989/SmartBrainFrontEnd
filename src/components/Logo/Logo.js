import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css' 
import brain from './brain.png'


const Logo = () => {
    return (
        <Tilt className= 'Tilt br2 shadow-2'  style={{ height: '125px', width: '125px'}}>
        <div className='mt0 pa3'><img style={{height: '100px', width: '100px'}} alt="Brain Logo" src={brain} />
        </div>
        </Tilt>
    );
}

export default Logo;