import './App.css';
import React, { Component } from 'react'
import "./Componets/CountingPage/TasbihPage.js"
import db from './Componets/Firebase/firebase.js';
import Home from './Componets/Home/HomePage.js' 
import { auth,provider } from "./Componets/Firebase/firebase";

export default class App extends Component {

  constructor(prop){
    super(prop)
  
    this.state = {
      count: 0,
      tasbihs:[]
    }
  } 

  IncreaseCount = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  componentDidMount(){
  db.collection('Tasbihs').onSnapshot(snap =>{
    snap.docs.map(doc =>{

      var tasbih = this.state.tasbihs;
      tasbih.push({id:doc.id,data:doc.data()});

      this.setState({
        tasbihs: tasbih
      });
      // if(doc.id === this.state.dbId){
      //   var docs =  doc.data();
      //   var {Info,...docs} = docs

      //   this.setState({
      //     itemInfo: {id:doc.id,data: Object.keys(docs).map(m=>{
      //       if(!isNaN(parseInt(m)))
      //         return [Number(m),docs[m]]
      //       })},
      //       tasbihs:{id:doc.id,data: Info},
      //   })
      // }
    })
  })
}
  
  render() {
    console.log(this.state);
    return (
      <div className="outer-container">
        {/* <h>Tasbih/Zikr</h>
        <TasbihCounter click={this.IncreaseCount} prop={this.state.count}/> */}
        <div className="inner-container">
          <Home/>
        </div>
      </div>
    )
  }
}