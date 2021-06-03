import React, { Component } from 'react'
import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
//import {auth} from '../Firebase/firebase'
import SideNav from '../NavigationMenu/SideNav/SideNav.js'


export default class Header extends Component {

     constructor(props){
         super(props);

         this.state = {
             sidebar: false
         }
     }

     OpenSideNavigation = () => {
         //console.log(this.state.sidebar);
         this.setState({sidebar: !this.state.sidebar});
     }

    render() {
        //console.log(this.props.userProfilePic);
        let photoUrl = this.props.userProfilePic === '' ? 'favicon.jpg' : this.props.userProfilePic;
        return (
            <div className="header-bar">
                <div className="left-h sub-header">
                    <div className="menu-bar">
                        <span className="Bar-class" onClick={this.OpenSideNavigation}>
                            <FontAwesomeIcon icon={faBars}/>
                        </span>
                        <SideNav navClass={this.state.sidebar ? 'side-navigation nav-menu open' : 'side-navigation nav-menu' }  click={this.props.click} userProfilePic={photoUrl} userName={this.props.userName}/>
                        <div className={this.state.sidebar ? 'backbone open' : 'backbone'} onClick={this.OpenSideNavigation}></div>
                    </div>
                </div>
                {/* <div className="right-h sub-header">
                </div> */}
            </div>
        )
    }
}
