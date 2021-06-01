import React, { Component } from 'react'

export default class TasbihCard extends Component {

    constructor(props){
        super(props);

        this.state = {
            Count:props.count,
            Name:props.name,
            Status:props.status
        }
    }


    increseCounter = () =>{
        this.setState({
            Count: this.state.Count + 1
        })
    }

    render() {
        return (
            <div className="tasbih-card-shell">
                <div className="tasbih-card-inner">
                    <div className="header-card">{this.state.Name}</div>
                    <div className="middle-card" onClick={this.increseCounter}>{this.state.Count}</div>
                    <div className="footer-card">{this.state.Status}</div>
                </div>
            </div>
        )
    }
}