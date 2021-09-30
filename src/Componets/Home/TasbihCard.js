import React, { useEffect, useState } from "react";
import db from "../Firebase/firebase";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiReset } from "react-icons/bi";

import { useSelector } from "react-redux";
const TasbihCard = props => {
  const [counts, setCounts] = useState(props.count);
  const name = props.name;
  const status = props.status;
  const path = props.path;

  const uid = useSelector(state => state.User.uid);
  const layout = useSelector(state => state.Settings.settings.Layout);

  const RemoveTasbih = async () => {
    try {
      if (uid !== "null") {
        var tasbihData = await db.doc(path).get();

        if (counts > 0) {
          var userDocPath = path.split("/")[0];
          var userData = await db.collection(userDocPath).doc(uid).get();
          await userData.ref.collection("HistoryTasbihs").add(historyDataTemplate(tasbihData.data(), "delete"));
        }

        await tasbihData.ref.delete();
      }

      console.log("Tasbih Has Been Removed");
    }
    catch (e) {
      console.log(e);
    }
  }

  const historyDataTemplate = (data, type) => {
    return {
      counts: data.count,
      deletedTime: new Date(),
      deleterPermanently: false,
      operationType: type,
      tasbihId: data.TasbihID,
      tasbihName: data.Name
    };
  };

  const ResetTasbih = async () => {
    if (counts > 0) {
      var userDocName = path.split("/")[0];
      var tasbihData = await db.doc(path).get();
      var user = await db.collection(userDocName).doc(uid).get();
      if (user) {
        await user.ref.collection("HistoryTasbihs").add(historyDataTemplate(tasbihData.data(), "reset"));
        tasbihData.ref.update({ count: 0 });
        setCounts(0);
      }
    }
  };

  const increseCounter = () => {
    var newCount = counts + 1;
    if (path !== "") {
      db.doc(path).get().then(tasbihData => {
        tasbihData.ref.update({ count: newCount });
      });
    }
    setCounts(newCount);
  };

  useEffect(
    () => {
      if (path !== "") {
        let unSub = db.doc(path).onSnapshot(
          tasbihData => {
            if (tasbihData.data()) setCounts(tasbihData.data().count);
          },
          err => {
            unSub();
          }
        );
      }
    },
    [path]
  );

  return (
    <div className={layout + " tasbih-card-shell"}>
      <div className="tasbih-card-inner">
        <div className="header-card">
          <div className="tasbih-name">{name}</div>
        </div>
        <div className="middle-card flex">
          <div className="tasbih-counts flex" onClick={increseCounter}>{counts}</div>
          <div className="side-panel">
            <span className="tasbih-remove" onClick={RemoveTasbih}>
              <RiDeleteBin5Line />
            </span>
            <span className="tasbih-reset" onClick={ResetTasbih}>
              <BiReset />
            </span>
          </div>
        </div>
      </div>
    </div >
  );
};

export default TasbihCard;
