import React, { Component } from 'react'
import "./HomePage.css"
import Body from './Body.js'
import Header from '../Header/Header.js'
import db from '../Firebase/firebase.js';
//import { super } from '@babel/types';

export default class HomePage extends Component {

    constructor(props){
        super(props);
    }

    render() {
        
        return (

            <div className="outer-container">
                 <Header click={this.props.click}/>
                <div className="inner-container">
                 <Body/> 
                </div> 
            </div>
            // <div className="outer-shell">
            //     <div className="home-body">{
            //             this.state.NoOfTasbih.map(x => {
            //                 return <TasbihCard name={x.Name} count={x.Count} status={x.Status}/>
            //             })
            //         }
            //         <TasbihDotedCard click={this.setModalView} />
            //         <ModalShow showModal={this.state.show} click={this.appendNewBlock} hideModal={this.setModalView}/>
            //     </div>
            // </div>
        )
    }
}
