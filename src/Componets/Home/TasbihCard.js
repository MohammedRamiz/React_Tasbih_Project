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
  const userDeleted = props.userDeleted;

  const isAnonymous = useSelector(state => state.User.isAnonymous);
  const uid = useSelector(state => state.User.uid);
  const layout = useSelector(state => state.Settings.settings.Layout);

  const RemoveTasbih = () => {
    if (uid !== "null") {
      db
        .doc(path)
        .get()
        .then(tasbihData => {
          if (counts > 0) {
            if (!isAnonymous) {
              db
                .collection("Users")
                .doc(uid)
                .get()
                .then(user => {
                  user.ref
                    .collection("HistoryTasbihs")
                    .add(historyDataTemplate(tasbihData.data(), "delete"))
                    .then(data => {
                      tasbihData.ref.delete();
                    });
                });
            } else {
              db
                .collection("GuestUsers")
                .doc(uid)
                .get()
                .then(user => {
                  user.ref
                    .collection("HistoryTasbihs")
                    .add(historyDataTemplate(tasbihData.data(), "delete"))
                    .then(data => {
                      tasbihData.ref.delete();
                    });
                });
            }
          } else {
            tasbihData.ref.delete();
            console.log("Tasbih Has Been Removed");
          }
          console.log("Tasbih Has Been Removed");
        });
    }
  };

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

  const ResetTasbih = () => {
    if (counts > 0) {
      db
        .doc(path)
        .get()
        .then(tasbihData => {
          if (!isAnonymous) {
            db
              .collection("Users")
              .doc(uid)
              .get()
              .then(user => {
                user.ref
                  .collection("HistoryTasbihs")
                  .add(historyDataTemplate(tasbihData.data(), "reset"))
                  .then(data => {
                    tasbihData.ref.update({ count: 0 });
                    setCounts(0);
                  });
              });
          } else {
            db
              .collection("GuestUsers")
              .doc(uid)
              .get()
              .then(user => {
                user.ref
                  .collection("HistoryTasbihs")
                  .add(historyDataTemplate(tasbihData.data(), "reset"))
                  .then(data => {
                    tasbihData.ref.update({ count: 0 });
                    setCounts(0);
                  });
              });
          }
        });
    }
  };

  const increseCounter = () => {
    var newCount = counts + 1;
    if (path !== "") {
      db
        .doc(path)
        .get()
        .then(tasbihData => {
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

            if (userDeleted) unSub();
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
          <div className="left">{name}</div>
          <div className="right">
            <span className="tasbih-remove" onClick={RemoveTasbih}>
              <RiDeleteBin5Line />
            </span>
          </div>
        </div>
        <div className="middle-card" onClick={increseCounter}>
          {counts}
        </div>
        <div className="footer-card">
          {status}
          <span className="tasbih-reset" onClick={ResetTasbih}>
            <BiReset />
          </span>
        </div>
      </div>
    </div>
  );
};

export default TasbihCard;
