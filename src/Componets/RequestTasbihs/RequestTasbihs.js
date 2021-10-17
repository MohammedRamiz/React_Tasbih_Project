import React, { useEffect } from 'react'

import "./requesttasbihs.css"

const RequestTasbihs = props => {
    useEffect(() => {
        props.pageName('Request', "request");
    });
    return (
        <div className="flex">
            <span className="flex text-demo">Under Devlopment</span>
        </div>
    )
}

export default RequestTasbihs
