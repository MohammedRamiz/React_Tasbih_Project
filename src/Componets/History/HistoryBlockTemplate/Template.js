import React from "react";
import { MdDeleteForever, MdRestore } from "react-icons/md";

const Template = props => {
  const path = props.path;

  const deleteTasbih = () => {
    props.delete(path);
  };

  return (
    <div className="history-container">
      <div className="history-block history-left">
        <div className="history-tn">
          <span className="history-tasbih-name">{props.name}</span>
        </div>
        <div className="history-tc">
          <span className="history-counts">{props.counts}</span>
        </div>
      </div>
      {props.delete && props.restore ? (
        <div className="history-block history-right">
          <div className="history-delete" onClick={deleteTasbih}>
            <span>
              <MdDeleteForever />
            </span>
          </div>
          <div className="history-restore" onClick={props.restore}>
            <span>
              <MdRestore />
            </span>
          </div>
        </div>
      ) : (
        <p>Deletet</p>
      )}
    </div>
  );
};

export default Template;
