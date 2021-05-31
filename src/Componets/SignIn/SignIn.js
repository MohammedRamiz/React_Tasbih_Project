import React, { Component } from 'react'

export default class SignIn extends Component {
    render() {
        return (
            <div className="user-sign-in flex">
                <button onClick={this.props.click}>Sign In With Google</button>
                <button className='skip-btn' onClick={this.props.skip}>SKIP</button>
            </div>
        )
    }
}
