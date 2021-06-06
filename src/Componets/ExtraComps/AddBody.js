import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import db from '../Firebase/firebase.js';

const AddBody = props => {
    const [name,setName] = useState('');
    const [noOfTasbihs,setNoOfTasbih] = useState([]);
    const [tid,setTID] = useState("None");

    const handleClose = () =>{
      props.hideModal();
    }

    const handleAddData = () => {
      if(name !== ''){
        props.click(name,tid,noOfTasbihs.length);
        setName('');
      }
      else{
        alert('Select Tasbih First');
      }
    }

    const handleOnChange = (e) =>{
      e.preventDefault();

      var val = noOfTasbihs.filter(function(item) {
        return item.Name === e.target.value
      })
      setName(e.target.value);
      setTID(val[0].ID);
    }    

    useEffect(() => {
      db.collection('Tasbihs').where('Visible','==',true).onSnapshot(snap =>{
            var noOfTasbihs = snap.docs.map(doc => {return{ID: doc.id,Name: doc.data().Name}});

            props.onTasbihChange(noOfTasbihs.length);

            setNoOfTasbih(noOfTasbihs);
      });
    },[props]);
    
        return (
      <Modal show={props.showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Tasbih</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
              <div className="add-tasbih-name" key="0">
                <div className="tasbih">
                  <select onChange={handleOnChange}>
                    <option>Choose Tasbih</option>
                    { 
                      noOfTasbihs.map(tasbih => {

                      var disable = props.displayedIds.filter(t => {
                          return t === tasbih.ID ? true : false
                        });

                      return <option disabled={disable[0]} key={tasbih.ID}>{tasbih.Name}</option>
                    })}
                  </select>
                </div>
              </div>
            }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="save-btn" onClick={handleAddData}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
        )
    }

export default AddBody;
