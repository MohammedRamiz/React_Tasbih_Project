import React, { Component } from 'react'
import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faSearch } from '@fortawesome/free-solid-svg-icons'

export default class Header extends Component {
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
                        <span>
                            <FontAwesomeIcon icon={faSearch}/>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
