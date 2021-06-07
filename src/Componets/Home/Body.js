import React, { useEffect, useState } from 'react'
import "./HomePage.css"
import TasbihDotedCard from "./TasbihDotedCard.js";
import TasbihCard from "./TasbihCard.js";
import ModalShow from "../ExtraComps/AddBody.js"
import db from '../Firebase/firebase.js';
//import { super } from '@babel/types';

const Body = props => {

    // constructor(props){
    //     super(props);
    //     this.state = {
    //         NoOfTasbih:[],
    //         show:false,
    //         uid: props.uid,
    //         isSkipped: props.skip,
    //         totalTasbihsCount:props.totalTasbihCounts,
    //         isLoading: true
    //     }
    // }

    const [noOfTasbih,setNoOfTasbih] = useState([]);
    const [show,setShow] = useState(false);
    const [uid,setUID] = useState(props.uid);
    const isSkipped = props.skip;
    const [totalTasbihsCount,setTotalTasbihCounts] = useState(props.totalTasbihCounts);
    const [isLoading,setLoading] = useState(true);

    const setModalView = () =>{
        // this.setState({
        //   show: !this.state.show
        // })
        setShow(!show);
    }


    const appendNewBlock = (tasbihName,tid,totalTasbihsCount) => {
        if(tasbihName){
            if(!isSkipped){
                db.collection("Users").doc(uid).get().then(user=>{
                    user.ref.collection('Tasbihs')
                                        .add({
                                            Status:"Running",
                                            Name: tasbihName,
                                            TasbihID:tid,
                                            count:0
                                        }).then(user => {
                                            console.log("Tasbih Added To Collection")
                                        })
                });
                                    
                // this.setState({
                //     show:false,
                //     totalTasbihsCount: totalTasbihsCount
                // });
                setShow(false);
                setTotalTasbihCounts(totalTasbihsCount);

            }
            else{
                db.collection("GuestUsers").doc(uid).get().then(user=>{
                    user.ref.collection('Tasbihs')
                                .add({
                                    Status:"Running",
                                    Name: tasbihName,
                                    TasbihID:tid,
                                    count:0
                                }).then(user => {
                                    console.log("Tasbih Added To Collection")
                                })
                });
                                    
                // this.setState({
                //     show:false,
                //     totalTasbihsCount:totalTasbihsCount
                // });
                setShow(false);
                setTotalTasbihCounts(totalTasbihsCount);
            }
        }
    }

    const onTasbihsChange = (totalTasbihs) => {
        //this.setState({totalTasbihsCount:totalTasbihs})
        setTotalTasbihCounts(totalTasbihs);
    }

    useEffect(() => {
        setNoOfTasbih([]);
        setUID(props.uid);

        if(isSkipped){
            db.collection("GuestUsers").doc(uid).collection('Tasbihs').onSnapshot(tasbih =>{
                
                var noOfTasbihs = tasbih.docs.map(data => {
                    let _data = data.data();
                    return {ID: data.id,Name:_data.Name,Count:_data.count,Status:_data.Status,path:data.ref.path,tID:data.data().TasbihID};
                });

                setNoOfTasbih(noOfTasbihs);
                setLoading(false);
            });
        }
        else{
            db.collection("Users").doc(uid).collection('Tasbihs').onSnapshot(tasbih =>{

                var noOfTasbihs = tasbih.docs.map(data => {
                    let _data = data.data();
                    return {ID: data.id,Name:_data.Name,Count:_data.count,Status:_data.Status,path:data.ref.path,tID:data.data().TasbihID};
                });

                setNoOfTasbih(noOfTasbihs);
                setLoading(false);
                
            });
        }
    },[isSkipped,uid,props.uid]);
        
        return (
            <div className="outer-shell">
                <div className="home-body">
                    {
                       noOfTasbih.map(x => {
                            return <TasbihCard key={x.ID} layout={props.layout} isSkipped={isSkipped} name={x.Name} count={x.Count} status={x.Status} path={x.path} uid={uid} />
                        })
                    }
                    
                    {   
                        (
                        isLoading ? <div className="no-more-tasbihs flex">Loading Your Tasbihs...</div> : 
                            (
                                noOfTasbih.length >= totalTasbihsCount ? 
                                    <span className="flex no-more-tasbihs">No More Tasbihs Available</span> : 
                                        <TasbihDotedCard layout={props.layout} click={setModalView} /> 
                            )
                        )
                    }
                    <ModalShow
                        displayedIds={noOfTasbih.map(t => t.tID.replace(" ",""))} 
                        onTasbihChange={onTasbihsChange} 
                        showModal={show} 
                        click={appendNewBlock} 
                        hideModal={setModalView}/>
                </div>
            </div>
        )
}

export default Body;