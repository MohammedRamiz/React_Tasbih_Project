import React, { useEffect } from 'react'

import "./requesttasbihs.css"

const RequestTasbihs = props => {
    useEffect(() => {
        props.pageName('Request', "request");
    });
    return (
        <div className="flex">
            <h2>Under Devlopment</h2>
        </div>
    )
}

export default RequestTasbihs
