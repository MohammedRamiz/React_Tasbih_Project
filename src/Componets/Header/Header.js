import React, { Component } from 'react'
import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faSearch } from '@fortawesome/free-solid-svg-icons'
import {auth} from '../Firebase/firebase'


export default class Header extends Component {

     constructor(props){
         super(props);
     }

    render() {
        return (
            <div className="header-bar">
                <div className="left-h sub-header">
                    <div className="menu-bar">
                        <span>
                            <FontAwesomeIcon icon={faBars}/>
                        </span>
                    </div>
                </div>
                <div className="right-h sub-header">
                <div className="search-bar">
                        <span className="log-out-btn">
                            <button onClick={this.props.click}>Log Off</button>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
