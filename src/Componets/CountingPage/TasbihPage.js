import React from 'react'

const TasbihPage = props => {
    return (
        <div>
            <button className="tasbih-counter" onClick={props.click}>{props.prop}</button>
        </div>
    )
}
export default TasbihPage;