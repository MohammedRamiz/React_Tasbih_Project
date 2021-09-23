import React, { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import db from "../Firebase/firebase.js";
import { auth } from "../Firebase/firebase";

import "./guestSignIn.css";

import { updateSettings, setUpUserData } from "../../action/action";
import { useSelector, useDispatch } from "react-redux";

const GuestSignInModel = props => {
    const [username, setUsername] = useState("Choose Tasbih");

    const settings = useSelector(s => s.Settings);
    const currUser = useSelector(s => s.User);
    const dispatch = useDispatch();

    const handleClose = () => {
        props.hideModal();
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
                    console.log("account found")
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
                dispatch(updateSettings({ loading: false }));
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

    const setusername = e => {
        setUsername(e.target.value);
    };

    useEffect(() => {
    }, []);

    return (
        <Modal show={props.showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Find Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="sign-in-with-username">
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                onChange={setusername}
                                type="text"
                                placeholder="Your Username"
                            />
                        </Form.Group>
                    </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" className="save-btn" onClick={signInGuestUser}>
                    sign in
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GuestSignInModel;
