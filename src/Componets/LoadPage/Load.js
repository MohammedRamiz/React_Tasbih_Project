import React,{Component} from 'react'
import {provider,auth} from '../Firebase/firebase'
import HomePage from '../Home/HomePage.js'
import SignInPage from '../SignIn/SignIn'

export default class Load extends Component {
    constructor(){
        super()
        this.state = {
            user: null,
            IsSkiped: false
        }

        this.LoginUser = this.LoginUser.bind(this);
        this.LogOutUser = this.LogOutUser.bind(this);
        this.SkipSignIn = this.SkipSignIn.bind(this);
        this.ReqForSignIn = this.ReqForSignIn.bind(this);
    }

    SkipSignIn(){
        this.setState({IsSkiped:true});
    }

    ReqForSignIn(){
        this.setState({IsSkiped:false,user:null});
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
        let Authentic = this.state.user || this.state.IsSkiped ? 
        <HomePage   click={this.LogOutUser}
                    signIn={this.ReqForSignIn}
                    skip={this.state.IsSkiped} 
                    userProfilePic={this.state.user ? this.state.user.photoURL:''} 
                    userName={this.state.user ? this.state.user.displayName:'UnKnown'}/> : <SignInPage click={this.LoginUser} skip={this.SkipSignIn}/>
        console.log(this.state.user)
        return ( <div>{Authentic}</div> )
    }
}


