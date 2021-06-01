import React,{Component} from 'react'
import {provider,auth} from '../Firebase/firebase'
import HomePage from '../Home/HomePage.js'
import SignInPage from '../SignIn/SignIn'

export default class Load extends Component {
    constructor(){
        super()
        this.state = {
            user: null,
            IsSkiped: false,
            loading:true
        }
    }

    SkipSignIn = () => {
        this.setState({IsSkiped:true});
    }

    ReqForSignIn = () => {
        this.setState({IsSkiped:false,user:null});
    }

    LoginUser = () =>  {
        auth.signInWithPopup(provider).then(res => {
            this.setState({user :res.user});
        });
    }

    LogOutUser = () => {
        auth.signOut().then(res => {
            this.setState({
                user: null,
                loading: false
            })
        })
    }

    componentWillMount() {
        auth.onAuthStateChanged(user => {
            console.log(user);
             this.setState({loading:false})
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

        return ( this.state.loading ? <div className="initialize flex">Loading...</div> : Authentic)
    }
}


