import React, { useEffect, useState } from "react";
import "./HomePage.css";
import TasbihDotedCard from "./TasbihDotedCard.js";
import TasbihCard from "./TasbihCard.js";
import ModalShow from "../ExtraComps/AddBody.js";
import db, { collection, v9DB } from "../Firebase/firebase.js";
import { doc, addDoc, onSnapshot, orderBy, query } from "firebase/firestore"
import { useSelector, useDispatch } from "react-redux";
import { recoredUnSubCall, execCalls, saveTasbihCache } from "../../action/action";

const Body = props => {
  const [noOfTasbih, setNoOfTasbih] = useState([]);
  const [show, setShow] = useState(false);
  const userType = useSelector(state => state.Settings.userType);
  const [isLoading, setLoading] = useState(true);

  const currentUser = useSelector(state => state.User);
  const totalTasbihsCount = useSelector(s => s.Settings.totalTasbihsCount);
  const tasbihCached = useSelector(state => state.TasbihCache)
  const dispatch = useDispatch();

  const appendNewBlock = async (tasbihName, tid) => {
    if (tasbihName) {
      setShow(false);
      var user = await doc(await collection(v9DB, userType), currentUser.uid)

      await addDoc(await collection(user, "Tasbihs"), {
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

    if (tasbihCached) {
      setNoOfTasbih(tasbihCached);
      setLoading(false);
      return;
    }

    dispatch(execCalls("RELEASE_BODY"));
    let tasbihCollection = await collection(await doc(await collection(v9DB, userType), currentUser.uid), "Tasbihs")

    var unSubs = onSnapshot(await query(tasbihCollection, orderBy("running", "desc")), tasbih => {
      console.log(tasbih.docs);
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
      dispatch(saveTasbihCache(noOfTasbihs, "TCACHE"));
    }, err => {
      unSubs();
    });

    dispatch(recoredUnSubCall(unSubs, 'BODY'));
  }, [currentUser, tasbihCached]);

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
