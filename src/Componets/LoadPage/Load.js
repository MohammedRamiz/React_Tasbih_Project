import React, { useState, useEffect } from "react";
import { provider, auth } from "../Firebase/firebase";
import HomePage from "../Home/HomePage.js";
import SignInPage from "../SignIn/SignIn";

import db from "../Firebase/firebase.js";
import { useSelector, useDispatch } from "react-redux";
import { setUpUserData, updateSettings } from "../../action/action";

const Load = () => {
  const [userDeleted, setUserDeleted] = useState(false);

  const dispatch = useDispatch();
  const currUser = useSelector(state => state.User);
  const settings = useSelector(state => state.Settings);

  //Moved To SignIn Component
  const SkipSignIn = () => {
    //setLoading(true);
    //setAnonymous(true);
    dispatch(updateSettings({ loading: true }));

    auth.signInAnonymously().then(loginUser => {
      dispatch(setUpUserData(loginUser.user));
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
          //setUsername(name);

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
                  currUser.ref.collection("Settings").add(settings.settings);

                  dispatch(
                    updateSettings({
                      loading: false,
                      totalTasbihsCount: allTasbihs.length
                    })
                  );
                });
            });
        });
    });
  };

  //Moved To SignIn Component
  const LoginUser = () => {
    auth.signInWithPopup(provider).then(res => {
      dispatch(setUpUserData(res.user));
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
                  .doc(currUser.uid)
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
                        user.ref.collection("Tasbihs").add({
                          count: 0,
                          TasbihID: allTasbihs[randPick].id,
                          Name: allTasbihs[randPick].data().Name,
                          Status: "Running"
                        });
                        user.ref.collection("Settings").add(settings.settings);
                        dispatch(
                          updateSettings({
                            loading: false,
                            totalTasbihsCount: allTasbihs.length
                          })
                        );
                      });
                  });
              });
          } else {
            console.log("User found");
            dispatch(
              updateSettings({
                loading: false
              })
            );
          }
        });
    });
  };

  const LogOutUser = () => {
    // dispatch(
    //   updateSettings({
    //     loading: true
    //   })
    // );
    if (currUser.isAnonymous) {
      db
        .collection("GuestUsers")
        .doc(currUser.uid)
        .update({ Deleted: true })
        .then(() => {
          setUserDeleted(true);
          auth
            .signOut()
            .then(() => {
              currUser
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
    dispatch(setUpUserData(null));
    dispatch(updateSettings({ loading: false }));
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
                    if (!snap.empty) {
                      console.log(settings);
                      dispatch(
                        updateSettings({
                          isUserIn: true,
                          settings: snap.docs[0].data(),
                          path: snap.docs[0].ref.path,
                          loading: false
                        })
                      );
                    } else {
                      data.ref.collection("Settings").add(settings.settings);
                    }

                    if (userDeleted) {
                      unSubSet();
                    }
                  },
                  err => {
                    console.log(err);
                  }
                );
                dispatch(setUpUserData(user));
                user.updateProfile({ displayName: data.data().Name });
                //setUsername(data.data().Name);
                setUserDeleted(false);
              } else {
                console.log("[GETUSERS] User Removed");
                dispatch(
                  updateSettings({
                    loading: false
                  })
                );
                setUserDeleted(true);
              }
            } else {
              dispatch(
                updateSettings({
                  loading: false
                })
              );
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
                    dispatch(
                      updateSettings({
                        isUserIn: true,
                        settings: snap.docs[0].data(),
                        path: snap.docs[0].ref.path,
                        isLoading: false
                      })
                    );
                  } else {
                    data.ref.collection("Settings").add(settings.settings);
                  }
                  if (userDeleted) {
                    unSubSet();
                  }
                },
                err => {
                  console.log(err);
                }
              );
              dispatch(setUpUserData({ user: user }));
              dispatch(
                updateSettings({
                  loading: false
                })
              );
              setUserDeleted(false);
            } else {
              console.log("User Removed");
              setUserDeleted(true);
              dispatch(
                updateSettings({
                  loading: false
                })
              );
            }
          });
      }
    } else {
      setUserDeleted(false);
      dispatch(
        updateSettings({
          loading: false
        })
      );
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return unsub;
  }, []);

  //useEffect(() => {}, [currUser]);

  let loadPage =
    currUser && !settings.loading ? (
      <HomePage click={LogOutUser} userDeleted={userDeleted} />
    ) : (
      <SignInPage click={LoginUser} skip={SkipSignIn} />
    );

  return settings.loading ? (
    <div className="initialize flex">Loading...</div>
  ) : (
    loadPage
  );
};

export default Load;
