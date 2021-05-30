import './App.css';
import React, { Component } from 'react'
import "./Componets/CountingPage/TasbihPage.js"
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