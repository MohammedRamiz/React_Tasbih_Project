import React, { useState } from "react";
import "./HomePage.css";
import Body from "./Body.js";
import History from "../History/History";
import Header from "../Header/Header.js";
import { Route } from "react-router-dom";

//import db from '../Firebase/firebase.js';

const HomePage = props => {
  const [pageName, setPageName] = useState("My Tasbihs");
  const [activePage, setActivePage] = useState("homepage");

  const assignPageName = pageName => {
    setPageName(pageName);
  };

  const changePageName = (pageName, activePage) => {
    setActivePage(activePage);
    setPageName(pageName);
  };

  return (
    <div className="outer-container">
      <Header
        click={props.click}
        signIn={props.signIn}
        pageName={pageName}
        setPageName={changePageName}
        activePage={activePage}
      />
      <div className="inner-container">
        <Route path="/" exact>
          <Body />
        </Route>
        <Route path="/history">
          <History
            userDeleted={props.userDeleted}
            uid={props.uid}
            isSkipped={props.skip}
            pageName={assignPageName}
          />
        </Route>
      </div>
    </div>
  );
};

export default HomePage;
