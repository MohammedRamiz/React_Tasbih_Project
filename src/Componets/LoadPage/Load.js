import React,{Component} from 'react'
import {provider,auth} from '../Firebase/firebase'
import {Route} from 'react-router-dom'
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
            userName: "UnKnown",
            totalTasbihCounts: 0,
            deleted:false
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
                user.user.updateProfile({displayName: name});

                db.collection("GuestUsers").doc(user.user.uid).set({Name: name ,uid: user.user.uid,Deleted:false});

                nog.docs[0].ref.update({count: newCount});
                this.setState({userName: name});

                db.collection("GuestUsers").doc(this.state.uid).get().then(user=>{
                    db.collection("Tasbihs").get().then(tasbihs => {
                         var allTasbihs = tasbihs.docs.map(doc => doc.data().Visible ? doc : null).filter(tasbih => tasbih ? tasbih : null );

                        console.log(allTasbihs);
                        var randPick = Math.floor(Math.random() * allTasbihs.length);

                        user.ref.collection("Tasbihs").add({count:0,TasbihID:allTasbihs[randPick].id,Name:allTasbihs[randPick].data().Name,Status:'Running'});
                        this.setState({loading:false,totalTasbihCounts:allTasbihs.length});
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
                      db.collection("Users").doc(this.state.uid).get().then(user=>{
                          db.collection("Tasbihs").get().then(tasbihs => {

                            var allTasbihs = tasbihs.docs.map(doc => doc.data().Visible ? doc : null).filter(tasbih => tasbih ? tasbih : null );
                            var randPick = Math.floor(Math.random() * allTasbihs.length);

                            console.log(allTasbihs);

                            user.ref.collection("Tasbihs").add({count:0,TasbihID:allTasbihs[randPick].id,Name:allTasbihs[randPick].data().Name,Status:'Running'});
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
        auth.signOut().then(() => {
            this.state.user.delete().then(() =>  {
                db.collection("GuestUsers").doc(this.state.uid).update({Deleted:true}).then(() =>{
                    this.setState({
                        user: null,
                        uid:'null',
                        loading: false,
                        isAnonymous: false
                    })
                    console.log('user Removed');
                });
              });
        },error => {console.log(error)});
    }

    componentWillMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                if(user.isAnonymous){
                    let unsubscibe = db.collection("GuestUsers").doc(user.uid).onSnapshot(data => {
                       if(data.data()){
                        if(!data.data().Deleted){
                            user.updateProfile({displayName: data.data().Name});   
                            this.setState({user:user,uid:user.uid,isAnonymous:user.isAnonymous,userName:data.data().Name});
                            this.setState({loading:false});
                        }
                        else{
                            this.setState({deleted: true});
                        }
                       }
                   });

                   if(this.state.deleted){
                       console.log("Unasubscribed");
                       unsubscibe();
                   }
                }
                else{
                    db.collection("Users").doc(user.uid).onSnapshot(data => {
                        if(data.data()){
                            this.setState({user:user,uid:user.uid,isAnonymous:user.isAnonymous,userName:data.data().Name});
                            this.setState({loading:false});
                        }
                   });
                }
            }else{
              this.setState({loading:false});
            }
        })
    }
   

    render() {        
        let Authentic = this.state.user || this.state.isAnonymous ? 
        <HomePage   click={this.LogOutUser}
                    signIn={this.ReqForSignIn}
                    skip={this.state.isAnonymous}
                    uid = {this.state.uid}
                    userProfilePic={!this.state.isAnonymous ? this.state.user.photoURL :''} 
                    userName={this.state.userName}
                    totalTasbihCounts={this.state.totalTasbihCounts}
                    isLoading={this.state.loading}/> :
        <SignInPage click={this.LoginUser} 
                    skip={this.SkipSignIn} />

        return ( this.state.loading ? <div className="initialize flex">Loading...</div> : Authentic)
    }
}


