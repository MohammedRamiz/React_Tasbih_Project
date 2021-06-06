import React from 'react'
import { Link } from 'react-router-dom'
import './SideNav.css'

const SideNav = props => {
    return (
        <div className={props.navClass}>
            <div className="profile-picture-box">
                <img alt="img" src={props.userProfilePic}/>
                <span className="user-name">{props.userName}</span>
            </div>
                <div className="content flex">
                    <div className="home-page">
                        <span className="home-page-btn content-btn" onClick={props.navMan}>
                            <Link to="/">My Tasbihs</Link>
                        </span>
                    </div>
                    <div className="tasbih-history">
                        <span className="tasbih-history-btn content-btn"onClick={props.navMan}> 
                            <Link to="/history">Tasbih History</Link>
                        </span>
                    </div>
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
