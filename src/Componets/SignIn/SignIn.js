import React from "react";
import db from "../Firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings, setUpUserData } from "../../action/action";
import { provider, auth } from "../Firebase/firebase";

const SignIn = props => {
  const dispatch = useDispatch();
  const settings = useSelector(s => s.Settings);
  const currUser = useSelector(s => s.User);

  //Guest User Sign In
  const GuestSignIn = () => {
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
                  currUser.ref
                    .collection("Settings")
                    .add(settings.settings)
                    .then(set => {
                      dispatch(
                        updateSettings({
                          isUserIn: true,
                          path: set.path,
                          loading: false,
                          totalTasbihsCount: allTasbihs.length
                        })
                      );
                    });
                });
            });
        });
    });
  };

  //Google Sign In
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

                        //console.log(allTasbihs);

                        user.ref.collection("Tasbihs").add({
                          count: 0,
                          TasbihID: allTasbihs[randPick].id,
                          Name: allTasbihs[randPick].data().Name,
                          Status: "Running"
                        });
                        user.ref.collection("Settings").add(settings.settings);
                        dispatch(
                          updateSettings({
                            isUserIn: true,
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

  return (
    <div className="user-sign-in flex">
      <button onClick={LoginUser}>Sign In With Google</button>
      <button className="skip-btn" onClick={GuestSignIn}>
        Enter As Guest
      </button>
    </div>
  );
};

export default SignIn;
