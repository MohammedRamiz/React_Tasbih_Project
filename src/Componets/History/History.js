import React, { useState, useEffect } from 'react'
import './History.css'
import db from '../Firebase/firebase';
import HistoryTemplate from './HistoryBlockTemplate/Template'

import {useSelector} from "react-redux"

const History = props => {
    const [tasbihsHistory, setTasbihHistory] = useState([]);
    const [totalCounts,setTotalCounts] = useState(0);
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
                        let counts = totalCounts;
                        setTotalCounts(counts + doc.data().counts);
                        return { id: doc.id, path: doc.ref.path, ...doc.data() };
                    });
                        console.log(totalCounts);
                    setTasbihHistory(historyTasbihs);
                }, er => console.log(er));
            });
        }
        else {
            db.collection('GuestUsers').doc(currUser.uid).get().then(userData => {
                userData.ref.collection("HistoryTasbihs").orderBy('deletedTime', 'desc').onSnapshot(tasbihData => {
                    let counts = 0;
                    const historyTasbihs = tasbihData.docs.map(doc => {
                        counts += doc.data().counts;
                        return { id: doc.id, path: doc.ref.path, ...doc.data() };
                    });

                    setTotalCounts(counts)
                    setTasbihHistory(historyTasbihs);

                }, er => console.log(er));
            });
        }
    }, []);

    return (
        <>
        <div className='history-tasbih-counter'>
            <div className='history-counter'>
                <p>Total:</p>
                {totalCounts}
            </div>
        </div>
        {
            tasbihsHistory.map(th => {
                if(th.deleterPermanently)
                    return <HistoryTemplate key={th.id} name={th.tasbihName} path={th.path} counts={th.counts}/> 
                else 
                    return <HistoryTemplate key={th.id} name={th.tasbihName} path={th.path} counts={th.counts} delete={DeletePermenantData} restore={RestoreTasbih} />
            })
        }
        </>
    )
}

export default History
