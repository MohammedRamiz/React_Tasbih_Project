import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings, setUpUserData } from "../../action/action";
import GuestSignInModal from "../ExtraComps/GuestSignInModel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons"


import db, { auth, v9Auth, signInWithPopup, collection, v9DB, updateProfile, provider, v9Provider } from "../Firebase/firebase";
import { getDocs, doc, setDoc, addDoc, updateDoc, query, where, onSnapshot, deleteDoc, getDoc } from "firebase/firestore";


function GoogleSignIn() {
    const dispatch = useDispatch();
    const currUser = useSelector(s => s.User);
    const [isUserNameLoginVisible, setUserNameLogin] = useState(false);
    const [show, setShowModal] = useState(false);

    useEffect(() => {

        var siteSet = collection(v9DB, "SiteSettings");
        var unSubSiteSet = onSnapshot(siteSet, siteSetting => {
            setUserNameLogin(siteSetting.docs[0].data().IsUserNameLoginVisible);
        });
    }, []);

    const signIn = async () => {
        try {
            dispatch(
                updateSettings({ loading: true })
            );
            const currentUser = await fetchCurrentSavedData();
            var newUserCred = await signInWithPopup(v9Auth, provider);
            var UsersCol = await collection(v9DB, "Users");
            var user = await doc(UsersCol, newUserCred.user.uid);
            var newDoc = await getDoc(user);

            if (!newDoc.exists()) {
                await setDoc(user, {
                    Name: newUserCred.user.displayName,
                    uid: user.id
                });
                await updateDoc(currentUser, { Deleted: true });
                setUserDataInFirebase(currentUser, newUserCred.user);
            } else {
                console.log("User found");
                dispatch(setUpUserData(newUserCred.user));
            }
        }
        catch (e) {
            console.log(e);
            dispatch(updateSettings({ loading: false }));
        }
    }

    const setUserDataInFirebase = async (oldUser, curretUser) => {
        const tasbihs = await getDocs(await collection(oldUser, "Tasbihs"));
        const set = await getDocs(await collection(oldUser, "Settings"));
        const historyTasbihs = await getDocs(await collection(oldUser, "HistoryTasbihs"));

        const userDoc = await doc(await collection(v9DB, "Users"), curretUser.uid);

        extractDataAndInsert(userDoc, tasbihs, "Tasbihs");
        extractDataAndInsert(userDoc, set, "Settings");
        extractDataAndInsert(userDoc, historyTasbihs, "HistoryTasbihs");

        dispatch(setUpUserData(curretUser));
        window.location.reload();
    };

    const extractDataAndInsert = async (ref, data, type) => {
        data.docs.forEach(async (_data) => {
            var col = await collection(ref, type);
            await addDoc(col, _data.data());
        });
    };

    const showModalView = () => {
        setShowModal(!show);
    }

    const fetchCurrentSavedData = async () => {
        var guestUsers = await collection(v9DB, "GuestUsers")
        var guestUserdoc = doc(guestUsers, currUser.uid);
        return guestUserdoc;
    }

    return (
        <>
            {
                isUserNameLoginVisible ? (
                    <button onClick={showModalView} >
                        <span>Sign In to other occount</span>
                    </button >) : ""
            }
            <button onClick={signIn}>
                <span>Sign In with</span>
                <span>
                    <FontAwesomeIcon className="google-icon" icon={faGoogle} />
                </span>
            </button>
            <GuestSignInModal showModal={show} hideModal={showModalView} />
        </>
    )

}

export default GoogleSignIn
