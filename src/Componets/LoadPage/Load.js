import React,{useState,useEffect} from 'react'
import {provider,auth} from '../Firebase/firebase'
import {Route} from 'react-router-dom'
import HomePage from '../Home/HomePage.js'
import SignInPage from '../SignIn/SignIn'

import db from '../Firebase/firebase.js';

export default function Load() {
    // constructor(){
    //     super()
    //     this.state = {
    //         user: null,
    //         isAnonymous: false,
    //         loading:true,
    //         uid: 'null',
    //         userName: "UnKnown",
    //         totalTasbihCounts: 0,
    //         deleted:false
    //     }
    // }

    const [user,setUser] = useState(null);
    const [isAnonymous,setAnonymous] = useState(false);
    const [loading,setLoading] = useState(true);
    const [uid,setUID] = useState('null');
    const [userName,setUsername] = useState("UnKnown");
    const [totalTasbihCounts,setTotalTasbihsCount] = useState(0);
    const [deleted,setDeleted] = useState(false);

    const SkipSignIn = () => {
        //this.setState({loading:true,isAnonymous:true});

        setLoading(true);
        setAnonymous(true);

        auth.signInAnonymously().then(user => {
            setUser(user.user);
            setUID(user.user.uid);
            db.collection("NoOfGuests").get().then(nog => {
                var newCount = nog.docs[0].data().count + 1;
                var name = "Guest" + newCount;
                user.user.updateProfile({displayName: name});

                db.collection("GuestUsers").doc(user.user.uid).set({Name: name ,uid: user.user.uid,Deleted:false});

                nog.docs[0].ref.update({count: newCount});

                setUsername(name);

                db.collection("GuestUsers").doc(uid).get().then(user=>{
                    db.collection("Tasbihs").get().then(tasbihs => {
                         var allTasbihs = tasbihs.docs.map(doc => doc.data().Visible ? doc : null).filter(tasbih => tasbih ? tasbih : null );

                        console.log(allTasbihs);
                        var randPick = Math.floor(Math.random() * allTasbihs.length);

                        user.ref.collection("Tasbihs").add({count:0,TasbihID:allTasbihs[randPick].id,Name:allTasbihs[randPick].data().Name,Status:'Running'});
                        //this.setState({loading:false,totalTasbihCounts:allTasbihs.length});
                        setLoading(false);
                        setTotalTasbihsCount(allTasbihs.length);
                    });
                });
            });
        });
    }

    const LoginUser = () =>  {
        auth.signInWithPopup(provider).then(res => {
            setUser(res.user);
            setUID(res.user.uid);
            setUsername(res.user.displayName);
            db.collection("Users").doc(res.user.uid).get().then(user => {
              if(!user.exists){
                  db.collection("Users").doc(user.id).set({Name: res.user.displayName,uid: user.id}).then(() => {
                      db.collection("Users").doc(uid).get().then(user=>{
                          db.collection("Tasbihs").get().then(tasbihs => {

                            var allTasbihs = tasbihs.docs.map(doc => doc.data().Visible ? doc : null).filter(tasbih => tasbih ? tasbih : null );
                            var randPick = Math.floor(Math.random() * allTasbihs.length);

                            console.log(allTasbihs);

                            user.ref.collection("Tasbihs").add({count:0,TasbihID:allTasbihs[randPick].id,Name:allTasbihs[randPick].data().Name,Status:'Running'});
                            setLoading(false);
                          });
                      });
                  });
              }else{
                  console.log("User found");
                  setLoading(false);
              }
            })
        });
    }

    const LogOutUser = () => {
        auth.signOut().then(() => {
            if(user.isAnonymous){
                user.delete().then(() =>  {
                    db.collection("GuestUsers").doc(uid).update({Deleted:true}).then(() =>{
                        setUser(null);
                        setUID('null');
                        setLoading(false);
                        setAnonymous(false);
                        console.log('user Removed');
                    });
                });
            }
            else{
                setUser(null);
                setUID('null');
                setLoading(false);
                setAnonymous(false);
                console.log('user Logout Successfully');
            }
        },error => {console.log(error)});
    }

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                if(user.isAnonymous){
                    let unsubscibe = db.collection("GuestUsers").doc(user.uid).onSnapshot(data => {
                       if(data.data()){
                        if(!data.data().Deleted){
                            user.updateProfile({displayName: data.data().Name});

                            setUser(user);
                            setUID(user.uid);
                            setAnonymous(user.isAnonymous);
                            setUsername(data.data().Name);
                            setLoading(false);
                        }
                        else{
                            setDeleted(true);
                            unsubscibe();
                        }
                       }
                   });
                }
                else{
                    db.collection("Users").doc(user.uid).onSnapshot(data => {
                        if(data.data()){
                            setUser(user);
                            setUID(user.uid);
                            setAnonymous(user.isAnonymous);
                            setUsername(data.data().Name);
                            setLoading(false);
                        }
                   });
                }
            }else{
             setLoading(false);
            }
        })
    },[]);
        
        let Authentic = user || isAnonymous ? 
        <HomePage   click={LogOutUser}
                    skip={isAnonymous}
                    uid = {uid}
                    userProfilePic={!isAnonymous ? user.photoURL :''} 
                    userName={userName}
                    totalTasbihCounts={totalTasbihCounts}
                    isLoading={loading}/> :
        <SignInPage click={LoginUser} 
                    skip={SkipSignIn} />

        return ( loading ? <div className="initialize flex">Loading...</div> : Authentic)
}


