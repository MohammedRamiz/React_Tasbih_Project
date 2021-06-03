import React, { Component } from 'react'
import './SideNav.css'

export default class SideNav extends Component {    
    render() {
        return (
            <div className={this.props.navClass}>
                <div className="profile-picture-box">
                    <img alt="img" src={this.props.userProfilePic}/>
                    <span className="user-name">{this.props.userName}</span>
                </div>
                 <div className="content flex">
                </div>
                <div className="footer flex flex-align-bottom">
                    <span className="log-out-btn"> 
                    { <button onClick={this.props.click}>Log Out</button> }
                    </span>
                </div>
            </div>
        )
    }
}
