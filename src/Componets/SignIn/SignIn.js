import React, { useState, useEffect } from "react";
import db from "../Firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings, setUpUserData } from "../../action/action";
import { provider, auth } from "../Firebase/firebase";
import { Form, Button } from "react-bootstrap";

const SignIn = props => {
  const dispatch = useDispatch();
  const settings = useSelector(s => s.Settings);
  const currUser = useSelector(s => s.User);

  const [username, setUsername] = useState("");
  const [isUserNameLoginVisible, setUserNameLogin] = useState(false);

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
          loginUser.user.updateProfile({
            displayName: name,
            uid: new Date().getTime()
          });
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

  const signInGuestUser = () => {
    dispatch(updateSettings({ loading: true }));
    db
      .collection("GuestUsers")
      .where("Name", "==", username)
      .where("Deleted", "==", false)
      .get()
      .then(data => {
        if (!data.empty) {
          auth.signInAnonymously().then(loginUser => {
            const ref = data.docs[0].ref;
            db
              .collection("GuestUsers")
              .doc(loginUser.user.uid)
              .set({
                Name: data.docs[0].data().Name,
                uid: loginUser.user.uid,
                Deleted: false
              })
              .then(userData => {
                ref.update({ Deleted: true });
                asyncFunc(ref, loginUser.user);
              });
          });
        } else {
          console.log("User Does Not Exists");
          dispatch(updateSettings({ loading: false }));
        }
      })
      .catch(er => {
        console.log(er);
      });
  };

  const asyncFunc = async (res, curretUser) => {
    const tasbihs = await res.collection("Tasbihs").get();
    const set = await res.collection("Settings").get();
    const historyTasbihs = await res.collection("HistoryTasbihs").get();

    db
      .collection("GuestUsers")
      .doc(curretUser.uid)
      .get()
      .then(doc => {
        res.delete();
        doc.ref
          .collection("Settings")
          .get()
          .then(doc => {
            doc.docs[0].ref.delete();
          });
        extractData(doc.ref, tasbihs, "Tasbihs");
        extractData(doc.ref, set, "Settings");
        extractData(doc.ref, historyTasbihs, "HistoryTasbihs");

        dispatch(setUpUserData(curretUser));
      });
  };

  const extractData = (ref, data, type) => {
    data.docs.forEach(data => {
      ref.collection(type).add(data.data());
    });
  };

  const getusername = e => {
    setUsername(e.target.value);
  };

  useEffect(() => {
    // db
    //   .collection("SiteSettings")
    //   .onSnapshot(data => {
    //     setUserNameLogin(data.docs[0].data().IsUserNameLoginVisible);
    //   });

    GuestSignIn();
  }, []);

  return (
    <div className="user-sign-in flex">
      {/* {isUserNameLoginVisible ? (
        <>
        <div className="sign-in-with-username">
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={getusername}
                type="email"
                placeholder="Your Username"
              />
            </Form.Group>
            <Button type="button" onClick={signInGuestUser} variant="">
              Guest Sign In
              </Button>
          </Form>
        </div>
        <p>-- OR --</p>
        </>
      ) : ''} */}
      <div className="sign-in-with">
        <button onClick={LoginUser} className="btn">
          Sign In With Google
        </button>
        <p >-- OR --</p>
        <button className="skip-btn btn" onClick={GuestSignIn}>
          Sign up as a guest
        </button>
      </div>
    </div>
  );
};

export default SignIn;
