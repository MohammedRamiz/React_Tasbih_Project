import React from 'react'
import './LoadingScreen.css'

function LoadingScreen() {
    return (
        <div className="initialize flex">
            <div className="loader">
                <span className="tasbih-points"></span>
                <span className="tasbih-points"></span>
                <span className="tasbih-points"></span>
                <span className="tasbih-points"></span>
                <span className="tasbih-points"></span>
                <span className="tasbih-points"></span>
                <span className="tasbih-points"></span>
            </div>
            <div>
                Loading...
            </div>
        </div>
    )
}

export default LoadingScreen
