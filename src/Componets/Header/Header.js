import React, { Component } from 'react'
import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faSearch } from '@fortawesome/free-solid-svg-icons'
import {auth} from '../Firebase/firebase'
import SideNav from '../NavigationMenu/SideNav/SideNav.js'


export default class Header extends Component {

     constructor(props){
         super(props);

         this.state = {
             sidebar: false
         }

         this.OpenSideNavigation = this.OpenSideNavigation.bind(this);
     }

     OpenSideNavigation() {
         console.log(this.state.sidebar);
         this.setState({sidebar: !this.state.sidebar});
     }

    render() {
        let photoUrl = this.props.userProfilePic === '' ? 'favicon.jpg' : this.props.userProfilePic;
        return (
            <div className="header-bar">
                <div className="left-h sub-header">
                    <div className="menu-bar">
                        <span className="Bar-class" onClick={this.OpenSideNavigation}>
                            <FontAwesomeIcon icon={faBars}/>
                        </span>
                        {
                            <SideNav navClass={this.state.sidebar ? 'side-navigation nav-menu open' : 'side-navigation nav-menu' } userProfilePic={photoUrl} userName={this.props.userName}/>
                        }
                    </div>
                </div>
                <div className="right-h sub-header">
                <div className="search-bar">
                        <span className="log-out-btn">
                            {
                                this.props.skip ?  <button onClick={this.props.signIn}>Sign In</button> :
                            <button onClick={this.props.click}>Log Off</button>
                            }
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
