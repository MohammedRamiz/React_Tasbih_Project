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
        this.state = {
            NoOfTasbih:[],
            show:false,
            uid: props.uid
        }
    }
    
    setModalView = () =>{
        this.setState({
          show: !this.state.show
        })
    }


    appendNewBlock = (tasbihName,tid) => {
        if(typeof tasbihName !== 'undefined'){
            if(!this.state.uid === 'null'){
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
                    show:false
                });
            }
            else{
                var noOfTasbih = this.state.NoOfTasbih;

                noOfTasbih.push({
                    Name: tasbihName,
                    Count:0,
                    Status:'Running',
                    ID: tid
                });

                this.setState({
                    NoOfTasbih: noOfTasbih,
                    show:false
                });
            }
        }
    }

    componentWillMount(){
        this.setState({
                NoOfTasbih: [],
                uid: this.props.uid
        });

        db.collection("Users").doc(this.state.uid).collection('Tasbihs').onSnapshot(tasbih =>{
            var noOfTasbihs = [];
            tasbih.docs.map(data => {
                let _data = data.data();
                console.log(data);
                noOfTasbihs.push({ID: data.id,Name:_data.Name,Count:_data.count,Status:_data.Status});
            })
            this.setState({
                NoOfTasbih: noOfTasbihs
            });
        });
    }

    render() {
        
        return (
            <div className="outer-shell">
                <div className="home-body">{
                        this.state.NoOfTasbih.map(x => {
                            return <TasbihCard key={x.ID} tid={x.ID} name={x.Name} count={x.Count} status={x.Status} uid={this.state.uid}/>
                        })
                    }
                    <TasbihDotedCard click={this.setModalView} />
                    <ModalShow showModal={this.state.show} click={this.appendNewBlock} hideModal={this.setModalView}/>
                </div>
            </div>
        )
    }
}