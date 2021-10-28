import React, { useState, useEffect } from 'react'
import './History.css'
import db from '../Firebase/firebase';
import HistoryTemplate from './HistoryBlockTemplate/Template'

import { useSelector, useDispatch } from "react-redux"
import { recoredUnSubCall, execCalls, saveHistoryCache } from '../../action/action'

const History = props => {
    const [tasbihsHistory, setTasbihHistory] = useState([]);
    const [totalCounts, setTotalCounts] = useState(0);

    const currUser = useSelector(state => state.User);
    const cachedHistory = useSelector(state => state.HistoryCache)
    const dispatch = useDispatch();

    const DeletePermenantData = async (path) => {
        await db.doc(path).update({ deleterPermanently: true });
        console.log("Tasbih deleted Permenantly")
    }

    const RestoreTasbih = () => {
        console.log("Tasbih Restored Successfully");
    }

    useEffect(() => {
        props.pageName('History', "history");

        if (cachedHistory) {
            setTasbihHistory(cachedHistory);
            return;
        }

        dispatch(execCalls("RELEASE_HISTORY"));
        if (!currUser.isAnonymous) {
            db.collection('Users').doc(currUser.uid).get().then(userData => {
                let unSubs = userData.ref.collection("HistoryTasbihs").orderBy('deletedTime', 'desc').onSnapshot(tasbihData => {
                    let counts = 0;
                    const historyTasbihs = tasbihData.docs.map(doc => {
                        counts += doc.data().counts;
                        return { id: doc.id, path: doc.ref.path, ...doc.data() };
                    });
                    setTotalCounts(counts)
                    props.countsHandler(counts);
                    setTasbihHistory(historyTasbihs);
                    dispatch(saveHistoryCache(historyTasbihs, "HCACHE"));
                }, er => console.log(er));

                dispatch(recoredUnSubCall(unSubs, "HISTORY"));

            });
        }
        else {
            db.collection('GuestUsers').doc(currUser.uid).get().then(userData => {
                var unSubs = userData.ref.collection("HistoryTasbihs").orderBy('deletedTime', 'desc').onSnapshot(tasbihData => {
                    let counts = 0;
                    const historyTasbihs = tasbihData.docs.map(doc => {
                        counts += doc.data().counts;
                        return { id: doc.id, path: doc.ref.path, ...doc.data() };
                    });

                    setTotalCounts(counts)
                    props.countsHandler(counts);
                    setTasbihHistory(historyTasbihs);
                    dispatch(saveHistoryCache(historyTasbihs, "HCACHE"));

                }, er => console.log(er));

                dispatch(recoredUnSubCall(unSubs, "HISTORY"));
            });
        }
    }, [cachedHistory]);


    var renderComp = tasbihsHistory.length > 0 ? (
        tasbihsHistory.map(th => {
            if (th.deleterPermanently)
                return <HistoryTemplate key={th.id} name={th.tasbihName} path={th.path} counts={th.counts} />
            else
                return <HistoryTemplate key={th.id} name={th.tasbihName} path={th.path} counts={th.counts} delete={DeletePermenantData} restore={RestoreTasbih} />
        })
    ) : (
        < span className="flex no-more-tasbihs" >No history found</span>
    );

    return (<> {renderComp} </>)
}

export default History
