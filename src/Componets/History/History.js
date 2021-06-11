import React, { useState, useEffect } from 'react'
import './History.css'
import db from '../Firebase/firebase';
import HistoryTemplate from './HistoryBlockTemplate/Template'

import {useSelector} from "react-redux"

const History = props => {
    const [tasbihsHistory, setTasbihHistory] = useState([]);
    const userDeleted = props.userDeleted;

    const currUser = useSelector(state => state.User);

    const DeletePermenantData = (path) => {
        db.doc(path).update({ deleterPermanently: true }).then((data) => {
            console.log(data);
            console.log("Tasbih deleted Permenantly")
        });
    }

    const RestoreTasbih = () => {
        console.log("Tasbih Restore Successfully");
    }

    useEffect(() => {
        props.pageName('History');
        if (!currUser.isAnonymous) {
            db.collection('Users').doc(currUser.uid).get().then(userData => {
                let unSubs = userData.ref.collection("HistoryTasbihs").where('deleterPermanently', "==", false).orderBy('deletedTime', 'desc').onSnapshot(tasbihData => {

                    const historyTasbihs = tasbihData.docs.map(doc => {
                        return { id: doc.id, path: doc.ref.path, ...doc.data() };
                    });

                    setTasbihHistory(historyTasbihs);

                    if (userDeleted)
                        unSubs();
                }, er => console.log(er));
            });
        }
        else {
            db.collection('GuestUsers').doc(currUser.uid).get().then(userData => {
                let unSubs = userData.ref.collection("HistoryTasbihs").where('deleterPermanently', "==", false).orderBy('deletedTime', 'desc').onSnapshot(tasbihData => {

                    const historyTasbihs = tasbihData.docs.map(doc => {
                        return { id: doc.id, path: doc.ref.path, ...doc.data() };
                    });

                    setTasbihHistory(historyTasbihs);

                    if (userDeleted)
                        unSubs();
                }, er => console.log(er));
            });
        }
    }, []);

    return (
        <>
        {
            tasbihsHistory.map(th => {
                return <HistoryTemplate key={th.id} name={th.tasbihName} path={th.path} counts={th.counts} delete={DeletePermenantData} restore={RestoreTasbih} />
            })
        }
        </>
    )
}

export default History
