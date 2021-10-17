import React from "react";
import { useSelector } from "react-redux";

const TasbihDotedCard = props => {
  return (
    <div
      className={
        "tasbih-card-shell-doted relative " +
        useSelector(state => state.Settings.settings.Layout) + " "
      }
    >
      <div className="tasbih-card-inner-dotted flex" onClick={props.click}>
        <span className="tasbih-icon-plus">Add Tasbih</span>
      </div>
    </div>
  );
};

export default TasbihDotedCard;