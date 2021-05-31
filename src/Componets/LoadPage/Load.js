import React,{Component} from 'react'
import {provider,auth} from '../Firebase/firebase'
import HomePage from '../Home/HomePage.js'
import SignInPage from '../SignIn/SignIn'

export default class Load extends Component {
    constructor(){
        super()
        this.state = {
            user: null
        }

        this.LoginUser = this.LoginUser.bind(this);
        this.LogOutUser = this.LogOutUser.bind(this);
    }

    LoginUser() {
        auth.signInWithPopup(provider).then(res => {
            this.setState({user :res.user});
        });
    }

    LogOutUser(){
        auth.signOut().then(res => {
            this.setState({
                user: null
            })
        })
    }
    componentWillMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user})
            }
        })
    }
    

    render() {
        let Authentic = this.state.user ? <HomePage click={this.LogOutUser} userProfilePic={this.state.user.photoURL} userName={this.state.user.displayName}/> : <SignInPage click={this.LoginUser}/>
        console.log(this.state.user)
        return ( <div>{Authentic}</div> )
    }
}


