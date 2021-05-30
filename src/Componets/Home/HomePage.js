import React, { Component } from 'react'
import "./HomePage.css"
import TasbihDotedCard from "./TasbihDotedCard.js";
import TasbihCard from "./TasbihCard.js";
import ModalShow from "../ExtraComps/AddBody.js"
import db from '../Firebase/firebase.js';
//import { super } from '@babel/types';

export default class HomePage extends Component {

    constructor(){
        super();
        this.state = {
            NoOfTasbih:[],
            show:false
        }
    }
    
    setModalView = () =>{
        this.setState({
          show: !this.state.show
        })
    }


    appendNewBlock = (prop) => {
        if(typeof prop !== 'undefined'){
            var noOfTasbih = this.state.NoOfTasbih;
            noOfTasbih.push({
                Name: prop,
                Count:0,
                Status:'Running'
            });
            
            this.setState({
                NoOfTasbih:noOfTasbih,
                show:false
            });
        }
    }

    componentDidMount(){
        db.collection('Tasbihs').onSnapshot(snap =>{
            var noOfTasbihs = [];
            snap.docs.map(doc =>{
              noOfTasbihs.push({ID: doc.id,Name: doc.data().Name,Count:0,Status:"Running"});
            });
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
                            return <TasbihCard name={x.Name} count={x.Count} status={x.Status}/>
                        })
                    }
                    <TasbihDotedCard click={this.setModalView} />
                    <ModalShow showModal={this.state.show} click={this.appendNewBlock} hideModal={this.setModalView}/>
                </div>
            </div>
        )
    }
}
