import './App.css';
import React, { Component } from 'react'
import "./Componets/CountingPage/TasbihPage.js"
import LoadPage from './Componets/LoadPage/Load'
import { auth,provider } from "./Componets/Firebase/firebase";

export default class App extends Component {

/*  constructor(prop){
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
  }*/
  
  render() {
    return (
        <LoadPage/>
    )
  }
}