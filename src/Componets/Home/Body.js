import React, { useEffect, useState } from "react";
import "./HomePage.css";
import TasbihDotedCard from "./TasbihDotedCard.js";
import TasbihCard from "./TasbihCard.js";
import ModalShow from "../ExtraComps/AddBody.js";
import db from "../Firebase/firebase.js";
import { useSelector } from "react-redux";
//import { super } from '@babel/types';

const Body = props => {
  const [noOfTasbih, setNoOfTasbih] = useState([]);
  const [show, setShow] = useState(false);
  const [uid, setUID] = useState(props.uid);
  const isSkipped = useSelector(state => state.User.isAnonymous);

  const [isLoading, setLoading] = useState(true);
  const userDeleted = props.userDeleted;

  const currentUser = useSelector(state => state.User);
  const totalTasbihsCount = useSelector(s => s.Settings.totalTasbihsCount);

  const setModalView = () => {
    setShow(!show);
  };

  const appendNewBlock = (tasbihName, tid, totalTasbihsCount) => {
    if (tasbihName) {
      if (!isSkipped) {
        db
          .collection("Users")
          .doc(currentUser.uid)
          .get()
          .then(user => {
            user.ref
              .collection("Tasbihs")
              .add({
                Status: "Running",
                Name: tasbihName,
                TasbihID: tid,
                count: 0
              })
              .then(user => {
                console.log("Tasbih Added To Collection");
              });
          });

        setShow(false);
        //setTotalTasbihCounts(totalTasbihsCount);
      } else {
        db
          .collection("GuestUsers")
          .doc(currentUser.uid)
          .get()
          .then(user => {
            user.ref
              .collection("Tasbihs")
              .add({
                Status: "Running",
                Name: tasbihName,
                TasbihID: tid,
                count: 0
              })
              .then(user => {
                console.log("Tasbih Added To Collection");
              })
              .catch(er => {
                console.log(er);
              });
          })
          .catch(er => {
            console.log(er);
          });
        setShow(false);
        //setTotalTasbihCounts(totalTasbihsCount);
      }
    }
  };

  //   const onTasbihsChange = totalTasbihs => {
  //     setTotalTasbihCounts(totalTasbihs);
  //   };

  useEffect(() => {
    setNoOfTasbih([]);
    setUID(props.uid);

    if (isSkipped) {
      if (!userDeleted) {
        let unSubs = db
          .collection("GuestUsers")
          .doc(currentUser.uid)
          .collection("Tasbihs")
          .onSnapshot(
            tasbih => {
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

              if (userDeleted) {
                console.log("[TASBIHS] User Removed");
                unSubs();
              }
            },
            err => {
              unSubs();
            }
          );
      } else {
      }
    } else {
      let unSubs = db
        .collection("Users")
        .doc(currentUser.uid)
        .collection("Tasbihs")
        .onSnapshot(
          tasbih => {
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

            if (userDeleted) {
              console.log("[TASBIHS] User Removed");
              unSubs();
            }
          },
          err => {
            unSubs();
          }
        );
    }
  }, []);

  return (
    <div className="outer-shell">
      <div className="home-body">
        {noOfTasbih.map(x => {
          return (
            <TasbihCard
              userDeleted={userDeleted}
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
          userDeleted={userDeleted}
        />
      </div>
    </div>
  );
};

export default Body;
