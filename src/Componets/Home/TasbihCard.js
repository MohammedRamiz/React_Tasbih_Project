import React, { useEffect, useState } from "react";
import db from "../Firebase/firebase";
import { RiDeleteBin5Line, RiPlayFill, RiPauseFill, RiTimer2Line, RiHashtag } from "react-icons/ri";
import { BiReset, BiHash } from "react-icons/bi";

import { useSelector } from "react-redux";
const TasbihCard = props => {
  const [counts, setCounts] = useState(props.count);
  const [displayContSection, setCountSection] = useState(false);
  const [displayComponent, setDisplayComp] = useState('hide');
  const name = props.name;
  const path = props.path;
  const isTasbihRunnig = props.running;


  const uid = useSelector(state => state.User.uid);
  const layout = useSelector(state => state.Settings.settings.Layout);
  const settingsPath = useSelector(state => state.Settings.path);
  const userType = useSelector(state => state.Settings.userType);

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
    if (isTasbihRunnig) {
      var newCount = counts + 1;
      if (path !== "") {
        db.doc(path).get().then(tasbihData => {
          tasbihData.ref.update({ count: newCount });
        });
      }
      setCounts(newCount);
    }
  };

  const runPauseTabih = async () => {
    var tasbihData = await db.collection(userType).doc(uid).collection("Tasbihs").get()
    tasbihData.docs.forEach((data) => { data.ref.update({ running: false }) })

    tasbihData = await db.collection(userType).doc(uid).collection("Tasbihs").doc(props.tasbihDocID).get()
    tasbihData.ref.update({ running: !isTasbihRunnig });
  }

  const toggleMainBody = () => {
    setCountSection(!displayContSection);
  }

  useEffect(
    () => {
      if (path !== "") {
        let unSub = db.doc(path).onSnapshot(
          tasbihData => {
            if (tasbihData.data()) setCounts(tasbihData.data().count);
          }, err => {
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
          <div className="side-panel-r">
            <span className="tasbih-start-pause" onClick={runPauseTabih}>
              {!isTasbihRunnig ? <RiPlayFill /> : <RiPauseFill />}
            </span>
            <span className="tasbih-record" onClick={toggleMainBody}>
              <RiTimer2Line className={!displayContSection ? "move-down ri-timer" : "move-up ri-timer "} />
              <BiHash className={!displayContSection ? "move-down bi-hash" : "move-up bi-hash"} />
            </span>
          </div>
          <div className="main-body relative">
            <div className={!displayContSection ? "move-down tasbih-counts main-inner flex" : "move-up tasbih-counts main-inner flex"} onClick={increseCounter}>{counts}</div>
            <div className={!displayContSection ? "move-down timer-panel main-inner flex" : "move-up timer-panel main-inner flex"}>Timer Section</div>
          </div>
          <div className="side-panel-l">
            <span className="tasbih-remove" onClick={RemoveTasbih}>
              <RiDeleteBin5Line />
            </span>
            <span className="tasbih-reset" onClick={ResetTasbih}>
              <BiReset />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasbihCard;
