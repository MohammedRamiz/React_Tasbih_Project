import React, { useEffect, useState } from 'react'
import db from '../Firebase/firebase'

const TasbihCard = props => {
    const [counts,setCounts] = useState(props.count);
    const [name] = useState(props.name);
    const [status] = useState(props.status);
    const [uid] = useState(props.uid);
    const [path] = useState(props.path);

    const RemoveTasbih = () => {
        if (uid !== "null") {
            db.doc(path).delete().then(() => {
                console.log("tasbih Has been Removed");
            });
        }
    }

    const ResetTasbih = () => {
        db.doc(path).get().then(tasbihData => {
                tasbihData.ref.update({ count: 0 });
        });

        setCounts(0);
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
                            <span className="tasbih-remove" onClick={RemoveTasbih}>X</span>
                        </div>
                    </div>
                    <div className="middle-card" onClick={increseCounter}>{counts}</div>
                    <div className="footer-card">
                        {status}
                        <span className="tasbih-reset" onClick={ResetTasbih}>R</span>
                    </div>
                </div>
            </div>
        )
}

export default TasbihCard;