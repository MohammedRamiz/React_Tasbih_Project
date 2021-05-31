import React, { Component } from 'react'

export default class TasbihPage extends Component {
    render() {
        //console.log(this.props)
        return (
            <div>
                <button className="tasbih-counter" onClick={this.props.click}>{this.props.prop}</button>
            </div>
        )
    }
}
