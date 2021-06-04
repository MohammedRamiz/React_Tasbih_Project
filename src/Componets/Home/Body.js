import React, { Component } from 'react'
import "./HomePage.css"
import TasbihDotedCard from "./TasbihDotedCard.js";
import TasbihCard from "./TasbihCard.js";
import ModalShow from "../ExtraComps/AddBody.js"
import db from '../Firebase/firebase.js';
//import { super } from '@babel/types';

export default class Body extends Component {

    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            NoOfTasbih:[],
            show:false,
            uid: props.uid,
            isSkipped: props.skip,
            totalTasbihsCount:props.totalTasbihCounts
        }
    }
    
    setModalView = () =>{
        this.setState({
          show: !this.state.show
        })
    }


    appendNewBlock = (tasbihName,tid,totalTasbihsCount) => {
        if(tasbihName){
            if(!this.state.isSkipped){
                db.collection("Users").doc(this.state.uid).get().then(user=>{
                    user.ref.collection('Tasbihs')
                                        .add({
                                            Status:"Running",
                                            Name: tasbihName,
                                            TasbihID:tid,
                                            count:0
                                        }).then(user => {
                                            console.log("Tasbih Added To Collection")
                                        })
                });
                                    
                this.setState({
                    show:false,
                    totalTasbihsCount: totalTasbihsCount
                });
            }
            else{
                db.collection("GuestUsers").doc(this.state.uid).get().then(user=>{
                    user.ref.collection('Tasbihs')
                                .add({
                                    Status:"Running",
                                    Name: tasbihName,
                                    TasbihID:tid,
                                    count:0
                                }).then(user => {
                                    console.log("Tasbih Added To Collection")
                                })
                });
                                    
                this.setState({
                    show:false,
                    totalTasbihsCount:totalTasbihsCount
                });
            }
        }
    }

    onTasbihsChange = (totalTasbihs) => {
        console.log(totalTasbihs);
        this.setState({totalTasbihsCount:totalTasbihs})
    }

    componentWillMount(){
        this.setState({
                NoOfTasbih: [],
                uid: this.props.uid
        });

        if(this.state.isSkipped){
            db.collection("GuestUsers").doc(this.state.uid).collection('Tasbihs').onSnapshot(tasbih =>{
                
                var noOfTasbihs = tasbih.docs.map(data => {
                    let _data = data.data();
                    return {ID: data.id,Name:_data.Name,Count:_data.count,Status:_data.Status,path:data.ref.path,tID:data.data().TasbihID};
                });
                this.setState({
                    NoOfTasbih: noOfTasbihs
                });
            });
        }
        else{
            db.collection("Users").doc(this.state.uid).collection('Tasbihs').onSnapshot(tasbih =>{

                var noOfTasbihs = tasbih.docs.map(data => {
                    let _data = data.data();
                    return {ID: data.id,Name:_data.Name,Count:_data.count,Status:_data.Status,path:data.ref.path,tID:data.data().TasbihID};
                });
                this.setState({
                    NoOfTasbih: noOfTasbihs
                });
            });
        }
    }

    render() {
        
        return (
            <div className="outer-shell">
                <div className="home-body">{
                        this.state.NoOfTasbih.map(x => {
                            return <TasbihCard key={x.ID} tid={x.ID} name={x.Name} count={x.Count} status={x.Status} path={x.path} uid={this.state.uid} />
                        })
                    }
                    {this.state.NoOfTasbih.length >= this.state.totalTasbihsCount ? <span className="flex no-more-tasbihs">No More Tasbihs Available</span> : <TasbihDotedCard click={this.setModalView} />}
                    <ModalShow displayedIds={this.state.NoOfTasbih.map(t => t.tID)} onTasbihChange={this.onTasbihsChange} showModal={this.state.show} click={this.appendNewBlock} hideModal={this.setModalView}/>
                </div>
            </div>
        )
    }
}