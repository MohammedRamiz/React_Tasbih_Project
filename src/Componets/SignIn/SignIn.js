import React, { useEffect } from "react";//useState,
import db from "../Firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings, setUpUserData } from "../../action/action";
import { provider, auth } from "../Firebase/firebase";

import LoadingScreen from "../LoadPage/LoadingScreen"
//import { Form, Button } from "react-bootstrap";

const SignIn = props => {
  const dispatch = useDispatch();
  const settings = useSelector(s => s.Settings);
  const currUser = useSelector(s => s.User);

  //const [username, setUsername] = useState("");
  //const [isUserNameLoginVisible, setUserNameLogin] = useState(false);

  //Guest User Sign In
  const GuestSignIn = async () => {
    dispatch(updateSettings({ loading: true }));
    console.log("Guest sign in started");

    await auth.signInAnonymously().then(async (loginUser) => {
      dispatch(setUpUserData(loginUser.user));

      var noOfGuests = await db.collection("NoOfGuests").get();
      var newCount = noOfGuests.docs[0].data().count + 1;
      var name = "Guest" + newCount;
      await loginUser.user.updateProfile({
        displayName: name,
        uid: new Date().getTime()
      });

      await db.collection("GuestUsers").doc(loginUser.user.uid).set({ Name: name, uid: loginUser.user.uid, Deleted: false });
      await noOfGuests.docs[0].ref.update({ count: newCount });

      var gUser = await db.collection("GuestUsers").doc(loginUser.user.uid).get();
      var tasbihs = await db.collection("Tasbihs").where("Visible", "==", true).get()
      var allTasbihs = tasbihs.docs.map(doc => doc);
      var randPick = Math.floor(Math.random() * allTasbihs.length);

      await gUser.ref.collection("Tasbihs").add({
        count: 0,
        TasbihID: allTasbihs[randPick].id,
        Name: allTasbihs[randPick].data().Name,
        Status: "Running"
      });
      var set = await gUser.ref.collection("Settings").add(settings.settings)
      console.log("Guest sign in ended");
      dispatch(
        updateSettings({
          isUserIn: true,
          path: set.path,
          // loading: false,
          totalTasbihsCount: allTasbihs.length
        })
      );
    });
  };

  //Google Sign In
  const LoginUser = async () => {
    auth.signInWithPopup(provider).then(async (res) => {
      //
      var retUser = await db.collection("Users").doc(res.user.uid).get();
      if (!retUser.exists) {
        await db.collection("Users").doc(retUser.id).set({ Name: res.user.displayName, uid: retUser.id })
        var updatedUserData = await db.collection("Users").doc(retUser.uid).get()
        var tasbihData = await db.collection("Tasbihs").where("Visible", "==", true).get()

        var allTasbihs = tasbihData.docs.map(doc => doc);
        var randPick = Math.floor(
          Math.random() * allTasbihs.length
        );

        await updatedUserData.ref.collection("Tasbihs").add({
          count: 0,
          TasbihID: allTasbihs[randPick].id,
          Name: allTasbihs[randPick].data().Name,
          Status: "Running"
        });
        await updatedUserData.ref.collection("Settings").add(settings.settings);

        dispatch(setUpUserData(res.user));

        dispatch(
          updateSettings({
            isUserIn: true,
            loading: false,
            totalTasbihsCount: allTasbihs.length
          })
        );
      } else {
        console.log("User found");
        dispatch(updateSettings({ loading: false }));
      }
    });
  };

  useEffect(() => {
    console.log("sign in useEffect Called")
    GuestSignIn();
  }, [currUser]);

  return (
    // <div className="user-sign-in flex">
    //   <div className="sign-in-with">
    //     <button onClick={LoginUser} className="btn">
    //       Sign In With Google
    //     </button>
    //     <p >-- OR --</p>
    //     <button className="skip-btn btn" onClick={GuestSignIn}>
    //       Sign up as a guest
    //     </button>
    //   </div>
    // </div>
    <LoadingScreen />
  );
};

export default SignIn;
