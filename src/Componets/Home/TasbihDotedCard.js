import React from 'react'

const TasbihDotedCard = props => {
    return (
        <div className={'tasbih-card-shell-doted '+props.layout} onClick={props.click}>
            <div className="tasbih-card-inner-dotted flex">
                <span className="tasbih-icon-plus">New Tasbih</span>
            </div>
        </div>
    )
}

export default TasbihDotedCard;
