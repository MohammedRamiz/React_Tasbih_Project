import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import db from '../Firebase/firebase.js';

export default class AddBody extends Component {

    constructor(){
        super()
        this.state = {
            name:'',
            noOfTasbihs: []
        }
    }

    handleClose = () =>{
      this.props.hideModal();
    }

    handleShow = () => {
        this.setState({show:true})
    }

    handleAddData = () => {
      console.log(this.state.name);
      if(this.state.name !== ''){
        this.props.click(this.state.name);
        this.setState({name:''});
      }
      else{
        alert('Enter Tasbih Name');
      }
    }

    handleOnChange = (e) =>{
      e.preventDefault();
      this.setState({
        name:  e.target.value
      })
    }

    componentDidMount() {
      db.collection('Tasbihs').onSnapshot(snap =>{
            var noOfTasbihs = [];
            snap.docs.map(doc =>{
              noOfTasbihs.push({ID: doc.id,Name: doc.data().Name});
            });

            this.setState({
                noOfTasbihs: noOfTasbihs
            });
      });
    }
    

    render() {
        return (
      <Modal show={this.props.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Tasbih Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
              <div className="add-tasbih-name" key="0">
                {/* <div className="tasbih">
                  <input type="text" placeholder="Enter Tasbih Name" onChange={this.handleOnChange} className="tasbih-name"/>
                </div> */}
                <div className="tasbih">
                  <select onChange={this.handleOnChange}>
                    <option>Choose Tasbih</option>
                    {this.state.noOfTasbihs.map(tasbih => {
                      return <option key={tasbih.ID}>{tasbih.Name}</option>
                    })}
                  </select>
                </div>
              </div>
            }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="save-btn" onClick={this.handleAddData}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
        )
    }
}
