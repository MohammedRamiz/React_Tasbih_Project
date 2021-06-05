import React from 'react'
import './SideNav.css'

const SideNav = props => {
        return (
            <div className={props.navClass}>
                <div className="profile-picture-box">
                    <img alt="img" src={props.userProfilePic}/>
                    <span className="user-name">{props.userName}</span>
                </div>
                 <div className="content flex">
                </div>
                <div className="footer flex flex-align-bottom">
                    <span className="log-out-btn"> 
                    { <button onClick={props.click}>Log Out</button> }
                    </span>
                </div>
            </div>
        )
}

export default SideNav;
