import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import "./SideNav.css";

import { useSelector } from "react-redux";

const SideNav = props => {
  const userDisplayName = useSelector(s => s.User.displayName);
  const profilePic = useSelector(s => s.User.photoURL);
  const isUserAnonymous = useSelector(s => s.User.isAnonymous);
  const [profileDetails, setProfileDetails] = useState({});

  const setPageConfigs = (pageConfig, activePage) => {
    props.navMan();
    props.setPageName(pageConfig, activePage);
  };

  const onChange = e => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setProfileDetails({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file);
  }

  return (
    <div className={props.navClass}>
      <div className="profile-picture-box">
        <label htmlFor="photo-upload" className="custom-img-upload">
          <span className="overlay">
            <img htmlFor="photo-upload" className="img-upload" alt="img" src={profilePic ? profilePic : "favicon.jpg"} />
            <FontAwesomeIcon className="profile-camera" icon={faCamera} />
          </span>
          <input id="photo-upload" type="file" onChange={onChange} />
        </label>
        <span className="user-name">{userDisplayName}</span>
      </div>
      <div className="content flex">
        <div className={props.activePage + " home-page"}>
          <span
            className="home-page-btn content-btn"
            onClick={() => setPageConfigs("My Tasbihs", "homepage")}
          >
            <Link to="/">My Tasbihs</Link>
          </span>
        </div>
        <div className={props.activePage + " tasbih-history"}>
          <span
            className="tasbih-history-btn content-btn"
            onClick={() => setPageConfigs("History", "history")}
          >
            <Link to="/history">Tasbih History</Link>
          </span>
        </div>
        <div className={props.activePage + " req-tasbih"} disable>
          <span
            className="tasbih-history-btn content-btn"
            onClick={() => setPageConfigs("Request", "request")}
          >
            <Link to="/request-tasbih">Request Tasbih</Link>
          </span>
        </div>
      </div>
      <div className="footer flex flex-align-bottom">
        {!isUserAnonymous ? (
          <span className="log-out-btn">
            {<button onClick={props.click}>Log Out</button>}
          </span>
        ) : (
            <span className="google-sign-up">
              {<button onClick={props.click}>
                <span>Sign In with</span>
                <span>
                  <FontAwesomeIcon className="google-icon" icon={faGoogle} />
                </span>
              </button>}
            </span>
          )}
      </div>
    </div>
  );
};

export default SideNav;
