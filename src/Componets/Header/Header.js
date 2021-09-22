import React, { useState } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SideNav from "../NavigationMenu/SideNav/SideNav.js";
import db from "../Firebase/firebase";
import { RiLayoutRowLine, RiLayoutColumnLine } from "react-icons/ri";
import { BrowserView, MobileView } from "react-device-detect";

import { useSelector } from "react-redux";

const Header = props => {
  const [sidebar, setsidebar] = useState(false);
  const settings = useSelector(state => state.Settings);

  const OpenSideNavigation = () => {
    setsidebar(!sidebar);
  };

  const ChangeLayout = () => {
    const layout =
      settings.settings.Layout === "colomn-layout"
        ? "row-layout"
        : "colomn-layout";

    db.doc(settings.path).update({ Layout: layout });
  };

  return (
    <div className="header-bar">
      <div className="left-h sub-header">
        <div className="menu-bar">
          <MobileView>
            <span className="Bar-class" onClick={OpenSideNavigation}>
              <FontAwesomeIcon icon={faBars} />
            </span>
          </MobileView>
          <div className="page-name">
            <span>{props.pageName}</span>
          </div>
          {props.pageName !== "History" ? (
            <span className="layout" onClick={ChangeLayout}>
              {settings.settings.Layout === "colomn-layout" ? (
                <RiLayoutColumnLine />
              ) : (
                  <RiLayoutRowLine />
                )}
            </span>
          ) : (
              ""
            )}
        </div>
        <MobileView>
          <SideNav
            navClass={
              sidebar ? (
                "side-navigation nav-menu open"
              ) : (
                  "side-navigation nav-menu"
                )
            }
            click={props.click}
            navMan={OpenSideNavigation}
            setPageName={props.setPageName}
            activePage={props.activePage}
          />
        </MobileView>
        <BrowserView>
          <SideNav
            navClass="side-navigation nav-menu"
            navMan={OpenSideNavigation}
            click={props.click}
            setPageName={props.setPageName}
            activePage={props.activePage}
          />
        </BrowserView>

        <div
          className={sidebar ? "backbone open" : "backbone"}
          onClick={OpenSideNavigation}
        />
      </div>
    </div>
  );
};

export default Header;
