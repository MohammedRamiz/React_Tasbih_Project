import React, { useState, useEffect } from "react";
import { provider, auth } from "../Firebase/firebase";
import HomePage from "../Home/HomePage.js";
import SignInPage from "../SignIn/SignIn";
import LoadingScreen from "./LoadingScreen"

import db from "../Firebase/firebase.js";
import { useSelector, useDispatch } from "react-redux";
import {
  setUpUserData,
  updateSettings,
  recoredUnSubCall,
  execCalls,
  resetSettings
} from "../../action/action";

const Load = () => {
  const dispatch = useDispatch();
  const currUser = useSelector(state => state.User);
  const settings = useSelector(state => state.Settings);

  const [userState, setUserState] = useState("");

  const LogOutUser = () => {
    setUserState("LOS");
    dispatch(execCalls());
    dispatch(resetSettings());

    if (currUser.isAnonymous) {
      auth
        .signOut()
        .then(() => {
          resetUser();
          console.log("user Removed");
        })
        .catch(er => console.log(er));
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
    setUserState("LOR");
  };

  const setCurrentUser = async user => {
    if (user) {
      dispatch(updateSettings({ loading: true }));
      if (user.isAnonymous) {
        var unSub = db
          .collection("GuestUsers")
          .doc(user.uid)
          .onSnapshot(
          async (data) => {
            if (data.data()) {
              if (!data.data().Deleted) {
                //await user.updateProfile({ displayName: data.data().Name });

                let unSubSet = await data.ref.collection("Settings").onSnapshot(
                  snap => {
                    if (!snap.empty) {
                      dispatch(
                        updateSettings({
                          isUserIn: true,
                          settings: snap.docs[0].data(),
                          path: snap.docs[0].ref.path
                        })
                      );
                    } else {
                      data.ref.collection("Settings").add(settings.settings);
                    }
                  },
                  err => {
                    console.log(err);
                  }
                );

                dispatch(setUpUserData(user));
                dispatch(recoredUnSubCall(unSubSet));
                dispatch(updateSettings({ loading: false }));

              } else {
                dispatch(
                  updateSettings({
                    loading: false
                  })
                );
              }
            } else {
              console.log("loading = false");
              dispatch(
                updateSettings({
                  loading: false
                })
              );
            }
          },
          err => console.log(err)
          );
        dispatch(recoredUnSubCall(unSub));
      } else {
        var func = db
          .collection("Users")
          .doc(user.uid)
          .onSnapshot(
          async (data) => {
            if (data.data()) {
              let unSubSet = await data.ref.collection("Settings").onSnapshot(
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
                },
                err => {
                  console.log(err);
                }
              );
              dispatch(recoredUnSubCall(unSubSet));
              dispatch(setUpUserData(user));
              dispatch(
                updateSettings({ loading: false })
              );
            } else {
              console.log("User Removed");
              dispatch(
                updateSettings({
                  loading: false
                })
              );
            }
          },
          er => console.log(er)
          );
        dispatch(recoredUnSubCall(func));
      }
    }
    else {
      console.log(user);
      console.log("user not found");
      if (userState === "LOR" || userState === "") {
        console.log("LOR");
        dispatch(
          updateSettings({
            loading: false
          })
        );
      }
    }
  };

  const setUser = () => {
    setUserState("LOR");
  };

  useEffect(async () => {
    const unsub = await auth.onAuthStateChanged(user => {
      console.log(user);
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  let loadPage = currUser && !settings.loading ? <HomePage click={LogOutUser} /> : <SignInPage click={setUser} />;

  return settings.loading ? <LoadingScreen /> : loadPage;
};

export default Load;
