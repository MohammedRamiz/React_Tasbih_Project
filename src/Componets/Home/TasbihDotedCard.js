import React, { Component } from 'react'

export default class TasbihDotedCard extends Component {
    render() {
        return (
            <div className="tasbih-card-shell-doted " onClick={this.props.click}>
                    <div className="tasbih-card-inner-dotted flex">
                        <span className="tasbih-icon-plus">New Tasbih</span>
                    </div>
            </div>
        )
    }
}
