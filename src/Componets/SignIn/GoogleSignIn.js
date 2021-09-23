import React, { useState, useEffect } from "react";
import db from "../Firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings, setUpUserData } from "../../action/action";
import { provider, auth } from "../Firebase/firebase";
import GuestSignInModal from "../ExtraComps/GuestSignInModel"


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons"



function GoogleSignIn() {
    const dispatch = useDispatch();
    //const settings = useSelector(s => s.Settings);
    const currUser = useSelector(s => s.User);

    //const [username, setUsername] = useState("");
    const [isUserNameLoginVisible, setUserNameLogin] = useState(false);
    const [show, setShowModal] = useState(false);

    useEffect(() => {
        db.collection("SiteSettings").onSnapshot(data => {
            setUserNameLogin(data.docs[0].data().IsUserNameLoginVisible);
        });
    }, []);

    const signIn = async () => {
        try {
            dispatch(
                updateSettings({ loading: true })
            );

            const currentUser = await fetchCurrentSavedData();
            var retValue = await auth.signInWithPopup(provider);
            var retUser = await db.collection("Users").doc(retValue.user.uid).get();

            if (!retUser.exists) {
                var retData = await db.collection("Users").doc(retUser.id).set({
                    Name: retValue.user.displayName,
                    uid: retUser.id
                });
                await currentUser.ref.update({ Deleted: true });
                setUserDataInFirebase(currentUser.ref, retValue.user);
            } else {
                console.log("User found");
                dispatch(setUpUserData(retValue.user));
            }
        }
        catch (e) {
            console.log(e);
            dispatch(updateSettings({ loading: false }));
        }
    }

    const setUserDataInFirebase = async (res, curretUser) => {
        const tasbihs = await res.collection("Tasbihs").get();
        const set = await res.collection("Settings").get();
        const historyTasbihs = await res.collection("HistoryTasbihs").get();

        const userDocs = await db.collection("Users").doc(curretUser.uid).get();

        //res.delete();
        const userSettings = await userDocs.ref.collection("Settings").get();

        userSettings.docs[0].ref.delete();
        extractDataAndInsert(userDocs.ref, tasbihs, "Tasbihs");
        extractDataAndInsert(userDocs.ref, set, "Settings");
        extractDataAndInsert(userDocs.ref, historyTasbihs, "HistoryTasbihs");

        dispatch(setUpUserData(curretUser));
        window.location.reload();
    };

    const extractDataAndInsert = async (ref, data, type) => {
        data.docs.forEach(async (data) => {
            await ref.collection(type).add(data.data());
        });
    };

    const showModalView = () => {
        setShowModal(!show);
    }

    const fetchCurrentSavedData = async () => {
        var data = await db.collection("GuestUsers").doc(currUser.uid).get();
        return data;
    }

    return (
        <>
        {
            isUserNameLoginVisible?(
                <button onClick= { showModalView } >
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
