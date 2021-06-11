import React from "react";
import { Link } from "react-router-dom";
import "./SideNav.css";

import { useSelector } from "react-redux";

const SideNav = props => {
  const userDisplayName = useSelector(s => s.User.displayName);
  const profilePic = useSelector(s => s.User.photoURL);

  const setPageConfigs = pageConfig => {
    props.navMan();
    props.setPageName(pageConfig);
  };

  return (
    <div className={props.navClass}>
      <div className="profile-picture-box">
        <img alt="img" src={profilePic ? profilePic : "favicon.jpg"} />
        <span className="user-name">{userDisplayName}</span>
      </div>
      <div className="content flex">
        <div className="home-page">
          <span
            className="home-page-btn content-btn"
            onClick={() => setPageConfigs("My Tasbihs")}
          >
            <Link to="/">My Tasbihs</Link>
          </span>
        </div>
        <div className="tasbih-history">
          <span
            className="tasbih-history-btn content-btn"
            onClick={() => setPageConfigs("History")}
          >
            <Link to="/history">Tasbih History</Link>
          </span>
        </div>
      </div>
      <div className="footer flex flex-align-bottom">
        <span className="log-out-btn">
          {<button onClick={props.click}>Log Out</button>}
        </span>
      </div>
    </div>
  );
};

export default SideNav;
