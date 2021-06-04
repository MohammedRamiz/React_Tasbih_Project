import React, { Component } from 'react'
import "./HomePage.css"
import Body from './Body.js'
import Header from '../Header/Header.js'
//import db from '../Firebase/firebase.js';

export default class HomePage extends Component {
    render() {
        
        return (
            <div className="outer-container">
                 <Header click={this.props.click} signIn={this.props.signIn} skip={this.props.skip} userProfilePic={this.props.userProfilePic} userName={this.props.userName}/>
                <div className="inner-container">
                 <Body uid={this.props.uid} skip={this.props.skip} totalTasbihCounts={this.props.totalTasbihCounts}/>
                </div> 
            </div>
        )
    }
}
