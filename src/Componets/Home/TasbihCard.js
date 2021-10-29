import React, { useEffect, useState } from "react";
import db, { collection, v9DB } from "../Firebase/firebase";
import { doc, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore'
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
  const userType = useSelector(state => state.Settings.userType);
  const chachedTasbihs = useSelector(state => state.TasbihCache);

  const RemoveTasbih = async () => {
    try {
      if (uid !== "null") {
        var tasbihData = await doc(v9DB, path);

        if (counts > 0) {
          var userData = await doc(await collection(v9DB, userType), uid);
          await addDoc(await collection(userData, "HistoryTasbihs"), historyDataTemplate(tasbihData.data(), "delete"));
        }

        await deleteDoc(tasbihData);
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
      debugger;
      var tasbihData = await getDoc(await doc(v9DB, path));
      var user = await doc(await collection(v9DB, userType), uid);
      console.log(tasbihData.data());
      if (user) {
        await addDoc(await collection(user, "HistoryTasbihs"), historyDataTemplate(tasbihData.data(), "reset"));
        await updateDoc(tasbihData.ref, { count: 0 });
        setCounts(0);
      }
    }
  };

  const increseCounter = async () => {
    if (isTasbihRunnig && !displayContSection) {
      if (path !== "") {
        var newCount = counts + 1;
        setCounts(newCount);
        await updateDoc(await doc(v9DB, path), { count: newCount });
      }
    }
  };

  const playPauseTasbih = async () => {
    var tasbihData;
    var currentRunning = chachedTasbihs.find(f => f.running === true);
    var user = await doc(await collection(v9DB, userType), uid);

    if (currentRunning) {
      var tasbihData = await doc(await collection(user, "Tasbihs"), currentRunning.ID);
      await updateDoc(tasbihData, { running: false });
    }

    tasbihData = await doc(await collection(user, "Tasbihs"), props.tasbihDocID);
    await updateDoc(tasbihData, { running: !isTasbihRunnig });
  }

  const toggleMainBody = () => {
    setCountSection(!displayContSection);
  }

  // useEffect(
  //   () => {
  //     // if (path !== "") {
  //     //   let unSub = db.doc(path).onSnapshot(
  //     //     tasbihData => {
  //     //       console.log("count Changed");
  //     //       if (tasbihData.data()) setCounts(tasbihData.data().count);
  //     //     }, err => {
  //     //       unSub();
  //     //     }
  //     //   );
  //     // }
  //   },
  //   [path]
  // );

  return (
    <div className={layout + " tasbih-card-shell"}>
      <div className="tasbih-card-inner">
        <div className="middle-card flex">
          <div className="side-panel-r">
            <span className="tasbih-start-pause" onClick={playPauseTasbih}>
              {!isTasbihRunnig ? <RiPlayFill /> : <RiPauseFill />}
            </span>
            <span className="tasbih-record" onClick={toggleMainBody}>
              <RiTimer2Line className={!displayContSection ? "move-down ri-timer" : "move-up ri-timer "} />
              <BiHash className={!displayContSection ? "move-down bi-hash" : "move-up bi-hash"} />
            </span>
          </div>
          <div className="main-body relative flex flex-colomn">
            <div className="upper-section header-card-shadow flex" onClick={increseCounter}>
              <div className="tasbih-name">{name}</div>
            </div>
            <div className="bottom-section width-100-per">
              <div className={!displayContSection ? "move-down tasbih-counts main-inner flex" : "move-up tasbih-counts main-inner flex"} onClick={increseCounter}>{counts}</div>
              <div className={!displayContSection ? "move-down timer-panel main-inner flex" : "move-up timer-panel main-inner flex"}>Loadnig data...</div>
            </div>
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
