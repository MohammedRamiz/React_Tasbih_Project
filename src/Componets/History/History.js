import React from 'react'
import './History.css'
import { MdDeleteForever,MdRestore } from 'react-icons/md';
import db from '../Firebase/firebase';

const History = props => {

    const DeletePermenantData = () => {
        console.log("Tasbih deleted Permenantly")
    }

    const RestoreTasbih = () => {
        console.log("Tasbih Restore Successfully");
    }

    return (
        <div className="history-container">
               <div className="history-block history-left">
                       <span className="history-counts">0</span>
               </div>
               <div className="history-block history-right">
                       <div className="history-delete" onClick={DeletePermenantData}>
                           <span><MdDeleteForever/></span>
                       </div>
                       <div className="history-restore" onClick={RestoreTasbih}>
                           <span><MdRestore/></span>
                       </div>
               </div>
        </div>
    )
}

export default History
