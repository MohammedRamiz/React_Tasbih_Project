import React, { Component } from 'react'
import db from '../Firebase/firebase'

export default class TasbihCard extends Component {

    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            Count: props.count,
            Name: props.name,
            Status: props.status,
            tid: props.tid,
            uid: props.uid,
            path: props.path
        }
    }

    RemoveTasbih = () => {
        if (this.state.uid !== "null") {
            db.doc(this.state.path).delete().then(user => {
                console.log("tasbih Has been Removed");
            });
        }
    }

    ResetTasbih = () => {
        var zeroCount = 0;
        db.doc(this.state.path).get().then(tasbihData => {
                tasbihData.ref.update({ count: zeroCount });
        });

        this.setState({
            Count: zeroCount
        });
    }

    increseCounter = () => {
        var newCount = this.state.Count + 1;
        if (this.state.path !== '') {
            db.doc(this.state.path).get().then(tasbihData => {
                tasbihData.ref.update({ count: newCount });
            });
        }

        this.setState({
            Count: newCount
        });
    }

    componentWillMount() {
        if (this.state.path !== '') {
            db.doc(this.state.path).onSnapshot(tasbihData => {
                if(tasbihData.data()) 
                    this.setState({Count: tasbihData.data().count})
            });
        }
    }
    

    render() {
        return (
            <div className="tasbih-card-shell">
                <div className="tasbih-card-inner">
                    <div className="header-card">
                        <div className="left">{this.state.Name}</div>
                        <div className="right">
                            <span className="tasbih-remove" onClick={this.RemoveTasbih}>X</span>
                        </div>
                    </div>
                    <div className="middle-card" onClick={this.increseCounter}>{this.state.Count}</div>
                    <div className="footer-card">
                        {this.state.Status}
                        <span className="tasbih-reset" onClick={this.ResetTasbih}>R</span>
                    </div>
                </div>
            </div>
        )
    }
}