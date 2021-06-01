import React,{Component} from 'react'
import {provider,auth} from '../Firebase/firebase'
import HomePage from '../Home/HomePage.js'
import SignInPage from '../SignIn/SignIn'

import db from '../Firebase/firebase.js';

export default class Load extends Component {
    constructor(){
        super()
        this.state = {
            user: null,
            IsSkiped: false,
            loading:true,
            uid: 'null'
        }
    }

    SkipSignIn = () => {
        this.setState({IsSkiped:true});
    }

    ReqForSignIn = () => {
        this.setState({IsSkiped:false,user:null,uid:"null"});
    }

    LoginUser = () =>  {
        auth.signInWithPopup(provider).then(res => {
            this.setState({user :res.user,uid:res.user.uid});
            db.collection("Users").doc(res.user.uid).get().then(user => {
              if(!user.exists){
                  db.collection("Users").doc(user.id).set({Name: res.user.displayName,uid: user.id}).then(user => {
                      console.log(this.state.uid);
                      db.collection("Users").doc(this.state.uid).get().then(user=>{
                          db.collection("Tasbihs").get().then(tasbihs => {
                            user.ref.collection("Tasbihs").add({count:0,TasbihID:tasbihs.docs[0].id,Name:tasbihs.docs[0].data().Name,Status:'Running'});
                          });
                      });
                  });
              }else{
                  console.log("User found");
              }
            })
        });
    }

    LogOutUser = () => {
        auth.signOut().then(res => {
            this.setState({
                user: null,
                uid:'null',
                loading: false,
                IsSkiped: false
            })
        })
    }

    componentWillMount() {
        auth.onAuthStateChanged(user => {
            this.setState({loading:false});
            if (user) {
                this.setState({user:user,uid:user.uid})
            }
        })
    }
    

    render() {        
        let Authentic = this.state.user || this.state.IsSkiped ? 
        <HomePage   click={this.LogOutUser}
                    signIn={this.ReqForSignIn}
                    skip={this.state.IsSkiped}
                    uid = {this.state.uid}
                    userProfilePic={this.state.user ? this.state.user.photoURL:''} 
                    userName={this.state.user ? this.state.user.displayName:'UnKnown'}/> : <SignInPage click={this.LoginUser} skip={this.SkipSignIn}/>

        return ( this.state.loading ? <div className="initialize flex">Loading...</div> : Authentic)
    }
}


