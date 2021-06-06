import React, {  useState,useEffect } from 'react'
import './History.css'
import db from '../Firebase/firebase';
import HistoryTemplate from './HistoryBlockTemplate/Template'

const History = props => {

    const [tasbihsHistory,setTasbihHistory] = useState([]);
    const uid = props.uid;

    const DeletePermenantData = (path) => {
        db.doc(path).update({deleterPermanently: true}).then((data)=>{
            console.log(data);
            console.log("Tasbih deleted Permenantly")
        });
    }

    const RestoreTasbih = () => {
        console.log("Tasbih Restore Successfully");
    }

    useEffect(() => {
        db.collection('Users').doc(uid).get().then(userData =>{
            userData.ref.collection("HistoryTasbihs").where('deleterPermanently',"==",false).orderBy('deletedTime','desc').onSnapshot(tasbihData => {

                const historyTasbihs = tasbihData.docs.map(doc =>{
                    return {id:doc.id,path:doc.ref.path,...doc.data()};
                });

                setTasbihHistory(historyTasbihs);
            })
        });
    },[]);

    return (
        <>
            {
                tasbihsHistory.map(th =>{
                    return <HistoryTemplate key={th.id} name={th.tasbihName} path={th.path} counts={th.counts} delete={DeletePermenantData} restore={RestoreTasbih}/>
                })
            }
        </>
    )
}

export default History
