import React,{useState} from 'react'
import "./HomePage.css"
import Body from './Body.js'
import History from '../History/History'
import Header from '../Header/Header.js'
import {Route} from 'react-router-dom'
import db from '../Firebase/firebase'
//import db from '../Firebase/firebase.js';

const HomePage = props => {
    const[pageName,setPageName] = useState('My Tasbihs');
    const settings = props.settings;
    const sPath = props.sPath;

    const assignPageName = (pageName) => {
        setPageName(pageName);
    }

    const changePageName = pageName =>{
        setPageName(pageName);
    }

    const setLayoutStyle = newLayout => {
        db.doc(sPath).update({Layout:newLayout});
    }
        return (
            <div className="outer-container">
                 <Header currUser={props.currentUser} settings={settings} click={props.click} signIn={props.signIn} setLayoutStyle={setLayoutStyle} pageName={pageName} setPageName={changePageName} skip={props.skip} userProfilePic={props.userProfilePic} userName={props.userName}/>
                <div className="inner-container">
                    <Route path="/" exact>
                        <Body userDeleted={props.userDeleted} uid={props.uid} currentUser={props.currentUser} layout={settings.Layout} isLoading={props.isLoading} skip={props.skip} totalTasbihCounts={props.totalTasbihCounts}/>
                    </Route>
                    <Route path="/history">
                        <History userDeleted={props.userDeleted} uid={props.uid} isSkipped={props.skip} pageName={assignPageName}/>
                    </Route>
                </div> 
            </div>
        )
}

export default HomePage;
