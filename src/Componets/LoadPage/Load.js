import React, { useState, useEffect } from "react";
import HomePage from "../Home/HomePage.js";
import SignInPage from "../SignIn/SignIn";
import LoadingScreen from "./LoadingScreen"
import LandingPage from "../Home/LandingPage/LandingPage.js"

import { v9DB, provider, v9auth, auth, onAuthStateChanged, v9Auth } from "../Firebase/firebase";
//import { auth } from "../Firebase/firebase";
import db from "../Firebase/firebase.js";
import { collection, getDoc, getDocs, onSnapshot, addDoc, setDoc, doc } from 'firebase/firestore'

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
    dispatch(execCalls("RELEASE"));
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

  const xxsetCurrentUser = async user => {
    if (user) {
      var userType = user.isAnonymous ? "GuestUsers" : "Users";
      dispatch(updateSettings({ loading: true, userType: userType }));
      console.log(userType);

      //var userData = getDoc(collection(v9db, userType));

      var unSub = db.collection(userType).doc(user.uid).onSnapshot(async (data) => {
        if (data.data()) {
          var optionExist = data.data().Deleted ? data.data().Deleted : false;
          if (!optionExist) {
            let unSubSet = data.ref.collection("Settings").onSnapshot(
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
            dispatch(recoredUnSubCall(unSubSet, "LOAD"));
            dispatch(updateSettings({ loading: false }));

          } else {
            dispatch(updateSettings({ loading: false }));
          }
        } else {
          dispatch(updateSettings({ loading: false }));
        }
      }, err => console.log(err));
      dispatch(recoredUnSubCall(unSub, "LOAD"));
    }
    else {
      console.log("user not found");
      if (userState === "LOR" || userState === "") {
        dispatch(
          updateSettings({
            loading: false
          })
        );
      }
    }
  };

  const setCurrentUser = async user => {
    if (user) {
      var userType = user.isAnonymous ? "GuestUsers" : "Users";
      dispatch(updateSettings({ loading: true, userType: userType }));

      var userRef = await collection(v9DB, userType);
      var userDoc = await doc(userRef, user.uid);
      var userDocUnsub = await onSnapshot(userDoc, doc => {
        if (doc.data()) {
          var optionExist = doc.data().Deleted ? doc.data().Deleted : false;
          if (!optionExist) {
            dispatch(setUpUserData(user));
          }
        }
        dispatch(updateSettings({ loading: false }));
      });

      var userSettingDoc = await collection(userDoc, "Settings");

      var settingUnsub = await onSnapshot(userSettingDoc, async (userSetting) => {
        dispatch(recoredUnSubCall(settingUnsub, "LOAD"));
        if (!userSetting.empty) {
          dispatch(
            updateSettings({
              isUserIn: true,
              settings: userSetting.docs[0].data(),
              path: userSetting.docs[0].ref.path
            })
          );
        }
        // else {
        //   await addDoc(userSettingDoc, settings.settings)
        // }
      });

      dispatch(recoredUnSubCall(userDocUnsub, "LOAD"));
    }
    else {
      console.log("user not found");
      if (userState === "LOR" || userState === "") {
        dispatch(
          updateSettings({
            loading: false
          })
        );
      }
    }
  }

  const setUser = () => {
    setUserState("LOR");
  };

  useEffect(async () => {
    var unsub = onAuthStateChanged(v9Auth, user => {
      setCurrentUser(user);
    })

    return unsub;
  }, []);

  let loadPage = currUser && !settings.loading ? <HomePage click={LogOutUser} /> : <SignInPage click={setUser} />; //<LandingPage />;

  return settings.loading ? <LoadingScreen /> : loadPage;
};

export default Load;
