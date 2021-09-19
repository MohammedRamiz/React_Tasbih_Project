import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import "./SideNav.css";

import { useSelector } from "react-redux";

const SideNav = props => {
  const userDisplayName = useSelector(s => s.User.displayName);
  const profilePic = useSelector(s => s.User.photoURL);
  const [profileDetails, setProfileDetails] = useState({});

  const setPageConfigs = pageConfig => {
    props.navMan();
    props.setPageName(pageConfig);
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
          <span className="overlay" onClick="">
            <img for="photo-upload" className="img-upload" alt="img" src={profilePic ? profilePic : "favicon.jpg"} />
            <FontAwesomeIcon className="profile-camera" icon={faCamera} />
          </span>
          <input id="photo-upload" type="file" onChange={onChange} />
        </label>
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
