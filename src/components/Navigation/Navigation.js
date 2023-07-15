import React from "react";

const Navigation = ({onRouteChange, isSignedIn}) => {
        if (isSignedIn) {
            return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            <p onClick={() => onRouteChange('signout')}className='f4 link dim black underline pa1 pointer'>Sign Out<br />ログアウト</p>
        </nav>
        );
        }
        else {
            return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            <p onClick={() => onRouteChange('signin')}className='f4 link dim black underline pa1 pointer'>Sign In<br />ログイン</p>
            <p onClick={() => onRouteChange('register')}className='f4 link dim black underline pa1 pointer'>Register<br />登録</p>
        </nav>
        );
        }
}

export default Navigation;