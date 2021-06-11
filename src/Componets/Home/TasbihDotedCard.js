import React from "react";
import { useSelector } from "react-redux";

const TasbihDotedCard = props => {
  return (
    <div
      className={
        "tasbih-card-shell-doted " +
        useSelector(state => state.Settings.settings.Layout)
      }
      onClick={props.click}
    >
      <div className="tasbih-card-inner-dotted flex">
        <span className="tasbih-icon-plus">New Tasbih</span>
      </div>
    </div>
  );
};

export default TasbihDotedCard;
