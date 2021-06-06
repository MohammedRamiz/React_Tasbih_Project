import React, { useEffect, useState } from 'react'
import db from '../Firebase/firebase'
import {RiDeleteBin5Line} from 'react-icons/ri'
import {BiReset} from 'react-icons/bi'

const TasbihCard = props => {
    const [counts,setCounts] = useState(props.count);
    const name = props.name;
    const status = props.status;
    const uid = props.uid;
    const path = props.path;

    const RemoveTasbih = () => {
        if (uid !== "null") {
            db.doc(path).get().then(tasbihData => {
                if(counts > 0){
                    db.collection('Users').doc(uid).get().then(user => {
                        user.ref.collection('HistoryTasbihs').add({
                            counts: tasbihData.data().count,
                            deletedTime: new Date(),
                            deleterPermanently: false,
                            operationType: 'delete',
                            tasbihId: tasbihData.data().TasbihID,
                            tasbihName: tasbihData.data().Name
                        }).then( data => {
                            tasbihData.ref.delete();
                        });
                    });
                }
                else{
                    tasbihData.ref.delete();
                    console.log('Tasbih Has Been Removed');
                }
                console.log("tasbih Has been Removed");
            });
        }
    }

    const ResetTasbih = () => {
        if(counts > 0){
            db.doc(path).get().then(tasbihData => {
                db.collection('Users').doc(uid).get().then(user => {
                    user.ref.collection('HistoryTasbihs').add({
                        counts: tasbihData.data().count,
                        deletedTime: new Date(),
                        deleterPermanently: false,
                        operationType: 'reset',
                        tasbihId: tasbihData.data().TasbihID,
                        tasbihName: tasbihData.data().Name
                    }).then( data => {
                        tasbihData.ref.update({ count: 0 });
                        setCounts(0);
                    });
                });
            });
        }
    }

    const increseCounter = () => {
        var newCount = counts + 1;
        if (path !== '') {
            db.doc(path).get().then(tasbihData => {
                tasbihData.ref.update({ count: newCount });
            });
        }
        setCounts(newCount);
    }

    useEffect(()=> {
        if (path !== '') {
            db.doc(path).onSnapshot(tasbihData => {
                if(tasbihData.data()) 
                    setCounts(tasbihData.data().count);
            });
        }
    },[path]);
    
        return (
            <div className="tasbih-card-shell">
                <div className="tasbih-card-inner">
                    <div className="header-card">
                        <div className="left">{name}</div>
                        <div className="right">
                            <span className="tasbih-remove" onClick={RemoveTasbih}><RiDeleteBin5Line/></span>
                        </div>
                    </div>
                    <div className="middle-card" onClick={increseCounter}>{counts}</div>
                    <div className="footer-card">
                        {status}
                        <span className="tasbih-reset" onClick={ResetTasbih}><BiReset/></span>
                    </div>
                </div>
            </div>
        )
}

export default TasbihCard;