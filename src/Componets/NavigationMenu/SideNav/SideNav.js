import React, { Component } from 'react'
import './SideNav.css'

export default class SideNav extends Component {

    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <div className={this.props.navClass}>
                <div className="profile-picture-box">
                    <img src={this.props.userProfilePic}/>
                    <span className="user-name">{this.props.userName}</span>
                </div>
                 <div className="content">
                </div> 
            </div>
        )
    }
}
