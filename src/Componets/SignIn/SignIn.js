import React, { Component } from 'react'

export default class SignIn extends Component {
    render() {
        return (
            <div className="user-sign-in">
                <button onClick={this.props.click}>Sign In With Google</button>
            </div>
        )
    }
}
