import React from 'react'
import "./HomePage.css"
import Body from './Body.js'
import Header from '../Header/Header.js'
//import db from '../Firebase/firebase.js';

const HomePage = props => {
        return (
            <div className="outer-container">
                 <Header click={props.click} signIn={props.signIn} skip={props.skip} userProfilePic={props.userProfilePic} userName={props.userName}/>
                <div className="inner-container">
                 <Body uid={props.uid} isLoading={props.isLoading} skip={props.skip} totalTasbihCounts={props.totalTasbihCounts}/>
                </div> 
            </div>
        )
}

export default HomePage;
