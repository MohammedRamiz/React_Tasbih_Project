import React, { useEffect, useState } from "react";
import "./HomePage.css";
import TasbihDotedCard from "./TasbihDotedCard.js";
import TasbihCard from "./TasbihCard.js";
import ModalShow from "../ExtraComps/AddBody.js";
import db from "../Firebase/firebase.js";
import { useSelector, useDispatch } from "react-redux";
import { recoredUnSubCall } from "../../action/action";

const Body = props => {
  const [noOfTasbih, setNoOfTasbih] = useState([]);
  const [show, setShow] = useState(false);
  const userType = useSelector(state => state.Settings.userType);

  const [isLoading, setLoading] = useState(true);

  const currentUser = useSelector(state => state.User);
  const totalTasbihsCount = useSelector(s => s.Settings.totalTasbihsCount);
  const dispatch = useDispatch();

  const setModalView = () => {
    setShow(!show);
  };

  const appendNewBlock = async (tasbihName, tid) => {
    if (tasbihName) {
      setShow(false);
      var user = await db.collection(userType).doc(currentUser.uid).get();
      await user.ref.collection("Tasbihs").add({
        Status: "Running",
        Name: tasbihName,
        TasbihID: tid,
        count: 0
      });
      console.log("Tasbih Added To Collection");
    }
  };

  useEffect(() => {
    setNoOfTasbih([]);

    let unSubs = db.collection(userType).doc(currentUser.uid).collection("Tasbihs").onSnapshot(tasbih => {
      var noOfTasbihs = tasbih.docs.map(data => {
        let _data = data.data();
        return {
          ID: data.id,
          Name: _data.Name,
          Count: _data.count,
          Status: _data.Status,
          path: data.ref.path,
          tID: data.data().TasbihID
        };
      });

      setNoOfTasbih(noOfTasbihs);
      setLoading(false);
    }, err => {
      unSubs();
    });

    dispatch(recoredUnSubCall(unSubs));
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
              status={x.Status}
              path={x.path}
            />
          );
        })}

        {isLoading ? (
          <div className="no-more-tasbihs flex">Loading Your Tasbihs...</div>
        ) : noOfTasbih.length >= totalTasbihsCount ? (
          <span className="flex no-more-tasbihs">
            No More Tasbihs Available
          </span>
        ) : (
              <TasbihDotedCard click={setModalView} />
            )}
        <ModalShow
          displayedIds={noOfTasbih.map(t => t.tID.replace(" ", ""))}
          showModal={show}
          click={appendNewBlock}
          hideModal={setModalView}
        />
      </div>
    </div>
  );
};

export default Body;
