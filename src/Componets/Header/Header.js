import React, { useState } from 'react'
import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import SideNav from '../NavigationMenu/SideNav/SideNav.js'


const Header = props => {
    const [sidebar,setsidebar] = useState(false);

     const OpenSideNavigation = () => {
         setsidebar(!sidebar);
     }
        let photoUrl = props.userProfilePic === '' ? 'favicon.jpg' : props.userProfilePic;
        return (
            <div className="header-bar">
                <div className="left-h sub-header">
                    <div className="menu-bar">
                        <span className="Bar-class" onClick={OpenSideNavigation}>
                            <FontAwesomeIcon icon={faBars}/>
                        </span>
                        <SideNav 
                            navClass={sidebar ? 'side-navigation nav-menu open' : 'side-navigation nav-menu' }  
                            click={props.click} 
                            userProfilePic={photoUrl} 
                            userName={props.userName}/>

                        <div className={sidebar ? 'backbone open' : 'backbone'} onClick={OpenSideNavigation}></div>
                    </div>
                </div>
            </div>
        )
}

export default Header;
