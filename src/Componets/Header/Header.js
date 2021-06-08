import React, { useState } from 'react'
import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import SideNav from '../NavigationMenu/SideNav/SideNav.js'
import db from '../Firebase/firebase'
import {RiLayoutRowLine,RiLayoutColumnLine} from 'react-icons/ri'

const Header = props => {
    const [sidebar,setsidebar] = useState(false);
    const settings = props.settings;


     const OpenSideNavigation = () => {
         setsidebar(!sidebar);
     }

     const ChangeLayout = () => {
        var layout = settings.Layout === 'colomn-layout' ? 'row-layout' : 'colomn-layout';
        props.setLayoutStyle(layout);
     }
        let photoUrl = props.userProfilePic === '' ? 'favicon.jpg' : props.userProfilePic;
        return (
            <div className="header-bar">
                <div className="left-h sub-header">
                    <div className="menu-bar">
                        <span className="Bar-class" onClick={OpenSideNavigation}>
                            <FontAwesomeIcon icon={faBars}/>
                        </span>
                        <div className="page-name">
                            <span>
                                {props.pageName}
                            </span>
                        </div>
                        {
                            props.pageName !== 'History' ? (
                                <span className="layout" onClick={ChangeLayout}>
                                    {settings.Layout  === 'colomn-layout' ? <RiLayoutColumnLine /> : <RiLayoutRowLine />}
                                </span>
                            ) : ''
                        }
                    </div>
                    <SideNav 
                            navClass={sidebar ? 'side-navigation nav-menu open' : 'side-navigation nav-menu' }  
                            click={props.click} 
                            userProfilePic={photoUrl} 
                            userName={props.userName}
                            navMan={OpenSideNavigation}
                            setPageName={props.setPageName}/>

                    <div className={sidebar ? 'backbone open' : 'backbone'} onClick={OpenSideNavigation}></div>
                </div>
            </div>
        )
}

export default Header;
