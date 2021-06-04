import React from 'react'

export default function History() {
    return (
        <div className="history-container">
               <div className="history-left">
                   <div>
                       <span className="history-counts">0</span>
                   </div>
               </div>
               <div className="history-right">
                   <div>
                       <div className="history-delete">
                           <span>Delete</span>
                       </div>
                       <div className="history-restore">
                           <span>Restore</span>
                       </div>
                   </div>
               </div>
        </div>
    )
}

