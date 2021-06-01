import React, { Component } from 'react'
import db from '../Firebase/firebase'

export default class TasbihCard extends Component {

    constructor(props){
        super(props);

        console.log(props);

        this.state = {
            Count:props.count,
            Name:props.name,
            Status:props.status,
            tid:props.tid,
            uid:props.uid
        }
    }

    RemoveTasbih = () => {
        console.log(this.state.uid);
        console.log(this.state.tid);
        if(this.state.uid !== "null"){
            db.collection("Users").doc(this.state.uid).get().then(user => {
                user.ref.collection("Tasbihs").doc(this.state.tid).delete().then(user =>{
                    console.log("tasbih Has been Removed");
                })
            });
        }
        else{
            this.props.click(this.state.tid);
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
                    <div className="header-card">
                        <div className="left">{this.state.Name}</div>
                        <div className="right">
                            <span className="tasbih-remove" onClick={this.RemoveTasbih}>X</span>
                        </div>
                    </div>
                    <div className="middle-card" onClick={this.increseCounter}>{this.state.Count}</div>
                    <div className="footer-card">{this.state.Status}</div>
                </div>
            </div>
        )
    }
}