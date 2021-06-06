import React from 'react'
import "./HomePage.css"
import Body from './Body.js'
import History from '../History/History'
import Header from '../Header/Header.js'
import {Route} from 'react-router-dom'
//import db from '../Firebase/firebase.js';

const HomePage = props => {
        return (
            <div className="outer-container">
                 <Header click={props.click} signIn={props.signIn} skip={props.skip} userProfilePic={props.userProfilePic} userName={props.userName}/>
                <div className="inner-container">
                    <Route path="/" exact>
                        <Body uid={props.uid} isLoading={props.isLoading} skip={props.skip} totalTasbihCounts={props.totalTasbihCounts}/>
                    </Route>
                    <Route path="/history">
                        <History uid={props.uid}/>
                    </Route>
                </div> 
            </div>
        )
}

export default HomePage;
