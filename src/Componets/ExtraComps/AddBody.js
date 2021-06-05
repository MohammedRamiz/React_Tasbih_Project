import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import db from '../Firebase/firebase.js';

export default class AddBody extends Component {

    constructor(props){
        super(props)
        this.state = {
            name:'',
            noOfTasbihs: [],
            tid:"None",
            tasbihsIds:[]
      }
    }

    handleClose = () =>{
      this.props.hideModal();
    }

    handleShow = () => {
        this.setState({show:true})
    }

    handleAddData = () => {
      if(this.state.name !== ''){
        this.props.click(this.state.name,this.state.tid,this.state.noOfTasbihs.length);
        this.setState({name:''});
      }
      else{
        alert('Select Tasbih First');
      }
    }

    handleOnChange = (e) =>{
      e.preventDefault();
      var val = this.state.noOfTasbihs.filter(function(item) {
        return item.Name === e.target.value
      })

      this.setState({
        name: e.target.value,
        tid: val[0].ID
      })
    }    

    componentDidMount() {
      db.collection('Tasbihs').onSnapshot(snap =>{
            var noOfTasbihs = snap.docs.map(doc => doc.data().Visible ? {ID: doc.id,Name: doc.data().Name} : null
                    ).filter(tasbih => tasbih ? tasbih : null );

            this.props.onTasbihChange(noOfTasbihs.length);

            this.setState({
                noOfTasbihs: noOfTasbihs
            });
      });
    }
    

    render() {
        return (
      <Modal show={this.props.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Tasbih</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
              <div className="add-tasbih-name" key="0">
                <div className="tasbih">
                  <select onChange={this.handleOnChange}>
                    <option>Choose Tasbih</option>
                    { 
                      this.state.noOfTasbihs.map(tasbih => {

                      var disable = this.props.displayedIds.filter(t => {
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
          <Button variant="primary" className="save-btn" onClick={this.handleAddData}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
        )
    }
}
