import React, { useState, useEffect } from "react";
import { provider, auth } from "../Firebase/firebase";
//import {Route} from 'react-router-dom'
import HomePage from "../Home/HomePage.js";
import SignInPage from "../SignIn/SignIn";

import db from "../Firebase/firebase.js";

const Load = () => {
  const [user, setUser] = useState(null);
  const [isAnonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uid, setUID] = useState("null");
  const [userName, setUsername] = useState("UnKnown");
  const [totalTasbihCounts, setTotalTasbihsCount] = useState(0);
  const [settings, setSettings] = useState({ Layout: "colomn-layout" });
  const [sPath, setSPath] = useState("");
  const [userDeleted, setUserDeleted] = useState(false);

  const SkipSignIn = () => {
    setLoading(true);
    setAnonymous(true);

    auth.signInAnonymously().then(loginUser => {
      setUser(loginUser.user);
      setUID(loginUser.user.uid);
      db
        .collection("NoOfGuests")
        .get()
        .then(nog => {
          var newCount = nog.docs[0].data().count + 1;
          var name = "Guest" + newCount;
          loginUser.user.updateProfile({ displayName: name });

          db
            .collection("GuestUsers")
            .doc(loginUser.user.uid)
            .set({ Name: name, uid: loginUser.user.uid, Deleted: false });

          nog.docs[0].ref.update({ count: newCount });
          setUsername(name);

          db
            .collection("GuestUsers")
            .doc(loginUser.user.uid)
            .get()
            .then(currUser => {
              db
                .collection("Tasbihs")
                .where("Visible", "==", true)
                .get()
                .then(tasbihs => {
                  var allTasbihs = tasbihs.docs.map(doc => doc);
                  var randPick = Math.floor(Math.random() * allTasbihs.length);

                  currUser.ref.collection("Tasbihs").add({
                    count: 0,
                    TasbihID: allTasbihs[randPick].id,
                    Name: allTasbihs[randPick].data().Name,
                    Status: "Running"
                  });
                  currUser.ref.collection("Settings").add(settings);
                  setLoading(false);
                  setTotalTasbihsCount(allTasbihs.length);
                });
            });
        });
    });
  };

  const LoginUser = () => {
    auth.signInWithPopup(provider).then(res => {
      setUser(res.user);
      setUID(res.user.uid);
      setUsername(res.user.displayName);
      db
        .collection("Users")
        .doc(res.user.uid)
        .get()
        .then(user => {
          if (!user.exists) {
            db
              .collection("Users")
              .doc(user.id)
              .set({ Name: res.user.displayName, uid: user.id })
              .then(() => {
                db
                  .collection("Users")
                  .doc(uid)
                  .get()
                  .then(user => {
                    db
                      .collection("Tasbihs")
                      .where("Visible", "==", true)
                      .get()
                      .then(tasbihs => {
                        var allTasbihs = tasbihs.docs.map(doc => doc);
                        var randPick = Math.floor(
                          Math.random() * allTasbihs.length
                        );

                        console.log(allTasbihs);

                        user.ref.collection("Tasbihs").add({
                          count: 0,
                          TasbihID: allTasbihs[randPick].id,
                          Name: allTasbihs[randPick].data().Name,
                          Status: "Running"
                        });
                        user.ref.collection("Settings").add(settings);
                        setLoading(false);
                        setTotalTasbihsCount(allTasbihs.length);
                      });
                  });
              });
          } else {
            console.log("User found");
            setLoading(false);
          }
        });
    });
  };

  const LogOutUser = () => {
    if (user.isAnonymous) {
      db
        .collection("GuestUsers")
        .doc(uid)
        .update({ Deleted: true })
        .then(() => {
          setUserDeleted(true);
          auth
            .signOut()
            .then(() => {
              user
                .delete()
                .then(() => {
                  resetUser();
                  console.log("user Removed end");
                })
                .catch(er => {
                  console.log(er);
                });
            })
            .catch(er => console.log(er));
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      auth.signOut().then(() => {
        resetUser();
        console.log("user Logout Successfully");
      });
    }
  };

  const resetUser = () => {
    setUser(null);
    setUID("null");
    setLoading(false);
    setAnonymous(false);
    setUserDeleted(false);
  };

  const setCurrentUser = user => {
    if (user) {
      if (user.isAnonymous) {
        db
          .collection("GuestUsers")
          .doc(user.uid)
          .get()
          .then(data => {
            if (data.data()) {
              if (!data.data().Deleted) {
                let unSubSet = data.ref.collection("Settings").onSnapshot(
                  snap => {
                    console.log("[Settings] Sanpshot Run");
                    if (!snap.empty) {
                      setSettings(snap.docs[0].data());
                      setSPath(snap.docs[0].ref.path);
                    } else {
                      data.ref.collection("Settings").add(settings);
                    }

                    if (userDeleted) {
                      console.log("[SETTING] User Remove");
                      unSubSet();
                    }
                  },
                  err => {
                    console.log(err);
                  }
                );
                user.updateProfile({ displayName: data.data().Name });
                setUser(user);
                setUID(user.uid);
                setAnonymous(user.isAnonymous);
                setUsername(data.data().Name);
                setLoading(false);
                setUserDeleted(false);
              } else {
                console.log("[GETUSERS] User Removed");
                setLoading(false);
                setUserDeleted(true);
              }
            } else {
              setLoading(false);
            }
          });
      } else {
        db
          .collection("Users")
          .doc(user.uid)
          .get()
          .then(data => {
            if (data.data()) {
              let unSubSet = data.ref.collection("Settings").onSnapshot(
                snap => {
                  if (!snap.empty) {
                    setSettings(snap.docs[0].data());
                    setSPath(snap.docs[0].ref.path);
                  } else {
                    data.ref.collection("Settings").add(settings);
                  }
                  if (userDeleted) {
                    unSubSet();
                  }
                },
                err => {
                  console.log(err);
                }
              );

              setUser(user);
              setUID(user.uid);
              setAnonymous(user.isAnonymous);
              setUsername(data.data().Name);
              setLoading(false);
              setUserDeleted(false);
            } else {
              console.log("User Removed");
              setUserDeleted(true);
              setLoading(false);
            }
          });
      }
    } else {
      setUserDeleted(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
  }, []);

  let loadPage =
    user || isAnonymous ? (
      <HomePage
        currentUser={user}
        click={LogOutUser}
        skip={isAnonymous}
        uid={uid}
        userProfilePic={!isAnonymous ? user.photoURL : ""}
        userName={userName}
        totalTasbihCounts={totalTasbihCounts}
        isLoading={loading}
        settings={settings}
        sPath={sPath}
        userDeleted={userDeleted}
      />
    ) : (
      <SignInPage click={LoginUser} skip={SkipSignIn} />
    );

  return loading ? <div className="initialize flex">Loading...</div> : loadPage;
};

export default Load;
