import React, { useState } from "react";
import "./HomePage.css";
import Body from "./Body.js";
import History from "../History/History";
import Header from "../Header/Header.js";
import RequestTasbihs from "../RequestTasbihs/RequestTasbihs.js"
import { Route } from "react-router-dom";

const HomePage = props => {
  const [pageName, setPageName] = useState("My Tasbihs");
  const [activePage, setActivePage] = useState("homepage");
  const [historyCounts, setHistoryCounts] = useState(0);

  const changePageName = (pageName, activePage) => {
    setActivePage(activePage);
    setPageName(pageName);
  };

  const totalHistoryCount = (counts) => {
    setHistoryCounts(counts);
  }

  return (
    <div className="outer-container">
      <Header
        click={props.click}
        signIn={props.signIn}
        pageName={pageName}
        setPageName={changePageName}
        activePage={activePage}
        totalCount={historyCounts}

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
            pageName={changePageName}
            countsHandler={totalHistoryCount}
          />
        </Route>
        {/* <Route path="/request-tasbih">
          <RequestTasbihs
            pageName={changePageName} />
        </Route> */}
      </div>
    </div>
  );
};

export default HomePage;
