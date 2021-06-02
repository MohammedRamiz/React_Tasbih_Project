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
            isAnonymous: false,
            loading:true,
            uid: 'null',
            userName: "UnKnown"
        }
    }

    SkipSignIn = () => {
        this.setState({loading:true,isAnonymous:true});
        auth.signInAnonymously().then(user => {
            this.setState({user:user.user,uid:user.user.uid});
            //console.log(user);
            db.collection("NoOfGuests").get().then(nog => {
                var newCount = nog.docs[0].data().count + 1;
                var name = "Guest" + newCount;
                db.collection("GuestUsers").doc(user.user.uid).set({Name: name ,uid: user.user.uid});
                console.log(this.state.uid);
                nog.docs[0].ref.update({count: newCount});
                this.setState({userName: name});

                db.collection("GuestUsers").doc(this.state.uid).get().then(user=>{
                    db.collection("Tasbihs").get().then(tasbihs => {
                        var randPick = Math.floor(Math.random() * tasbihs.docs.length);
                        user.ref.collection("Tasbihs").add({count:0,TasbihID:tasbihs.docs[randPick].id,Name:tasbihs.docs[randPick].data().Name,Status:'Running'});
                        this.setState({loading:false});
                    });
                });
            });
        });
    }

    ReqForSignIn = () => {
        this.setState({isAnonymous:false,user:null,uid:"null"});
    }

    LoginUser = () =>  {
        auth.signInWithPopup(provider).then(res => {
            this.setState({user :res.user,uid:res.user.uid,userName:res.user.displayName});
            db.collection("Users").doc(res.user.uid).get().then(user => {
              if(!user.exists){
                  db.collection("Users").doc(user.id).set({Name: res.user.displayName,uid: user.id}).then(user => {
                      console.log(this.state.uid);
                      db.collection("Users").doc(this.state.uid).get().then(user=>{
                          db.collection("Tasbihs").get().then(tasbihs => {
                            var randPick = Math.floor(Math.random() * tasbihs.docs.length);
                            user.ref.collection("Tasbihs").add({count:0,TasbihID:tasbihs.docs[randPick].id,Name:tasbihs.docs[randPick].data().Name,Status:'Running'});
                            this.setState({loading:false});
                          });
                      });
                  });
              }else{
                  console.log("User found");
                  this.setState({loading:false});
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
                isAnonymous: false
            })
        })
    }

    componentWillMount() {
        auth.onAuthStateChanged(user => {
            console.log(user);
            if (user) {
                this.setState({user:user,uid:user.uid,isAnonymous:user.isAnonymous})
            }
            this.setState({loading:false});
        })
    }
    

    render() {        
        let Authentic = this.state.user || this.state.isAnonymous ? 
        <HomePage   click={this.LogOutUser}
                    signIn={this.ReqForSignIn}
                    skip={this.state.isAnonymous}
                    uid = {this.state.uid}
                    userProfilePic={!this.state.isAnonymous ? this.state.user.photoURL :''} 
                    userName={this.state.userName}/> : <SignInPage click={this.LoginUser} skip={this.SkipSignIn}/>

        return ( this.state.loading ? <div className="initialize flex">Loading...</div> : Authentic)
    }
}


