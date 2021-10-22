import React, { useEffect, useState } from "react";
import "./HomePage.css";
import TasbihDotedCard from "./TasbihDotedCard.js";
import TasbihCard from "./TasbihCard.js";
import ModalShow from "../ExtraComps/AddBody.js";
import db from "../Firebase/firebase.js";
import { useSelector, useDispatch } from "react-redux";
import { recoredUnSubCall, execCalls } from "../../action/action";

const Body = props => {
  const [noOfTasbih, setNoOfTasbih] = useState([]);
  const [show, setShow] = useState(false);
  const userType = useSelector(state => state.Settings.userType);
  const [isLoading, setLoading] = useState(true);

  const currentUser = useSelector(state => state.User);
  const totalTasbihsCount = useSelector(s => s.Settings.totalTasbihsCount);
  const dispatch = useDispatch();

  const appendNewBlock = async (tasbihName, tid) => {
    if (tasbihName) {
      setShow(false);
      var user = await db.collection(userType).doc(currentUser.uid).get();
      await user.ref.collection("Tasbihs").add({
        Name: tasbihName,
        TasbihID: tid,
        count: 0,
        running: false
      });
      console.log("Tasbih Added To Collection");
    }
  };

  useEffect(async () => {
    setNoOfTasbih([]);
    dispatch(execCalls("RELEASE_BODY"));
    let unSubs = db.collection(userType).doc(currentUser.uid).collection("Tasbihs")
      .orderBy("running", "desc")
      .onSnapshot(tasbih => {
        var noOfTasbihs = tasbih.docs.map(data => {
          const _data = data.data();
          return {
            ID: data.id,
            Name: _data.Name,
            Count: _data.count,
            path: data.ref.path,
            tID: _data.TasbihID,
            running: _data.running
          };
        });

        setNoOfTasbih(noOfTasbihs);
        setLoading(false);
      }, err => {
        unSubs();
      });

    dispatch(recoredUnSubCall(unSubs, 'BODY'));
  }, [currentUser]);

  return (
    <div className="outer-shell">
      <div className="home-body">
        {noOfTasbih.map(x => {
          return (
            <TasbihCard
              key={x.ID}
              name={x.Name}
              count={x.Count}
              path={x.path}
              running={x.running}
              tasbihDocID={x.ID}
              tID={x.tID}
            />
          );
        })}

        {isLoading ? (
          <div className="no-more-tasbihs flex">Loading Your Tasbihs...</div>
        ) : noOfTasbih.length >= totalTasbihsCount ? (
          <span className="flex no-more-tasbihs">
            No More Tasbihs Available. You can request for tasbih.
          </span>
        ) : (
          <TasbihDotedCard click={() => { setShow(!show) }} />
        )}
        <ModalShow
          displayedIds={noOfTasbih.map(t => t.tID.replace(" ", ""))}
          showModal={show}
          click={appendNewBlock}
          hideModal={() => { setShow(!show) }}
        />
      </div>
    </div>
  );
};

export default Body;
