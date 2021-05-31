import React, { Component } from 'react'
import "./HomePage.css"
import Body from './Body.js'
import Header from '../Header/Header.js'
import db from '../Firebase/firebase.js';
//import { super } from '@babel/types';

export default class HomePage extends Component {

    constructor(props){
        super(props);
    }

    render() {
        
        return (

            <div className="outer-container">
                 <Header click={this.props.click} signIn={this.props.signIn} skip={this.props.skip} userProfilePic={this.props.userProfilePic} userName={this.props.userName}/>
                <div className="inner-container">
                 <Body/> 
                </div> 
            </div>
        )
    }
}
