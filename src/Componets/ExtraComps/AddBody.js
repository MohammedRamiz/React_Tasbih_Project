import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';

export default class AddBody extends Component {

    constructor(){
        super()
        this.state = {
            name:''
        }
    }

    handleClose = () =>{
      this.props.hideModal();
    }

    handleShow = () => {
        this.setState({show:true})
    }

    handleAddData = () =>{

      if(this.state.name !== ''){
        this.props.click(this.state.name)
      }
      else{
        alert('Enter Value')
      }
    }

    handleOnChange = (e) =>{
      e.preventDefault();
      this.setState({
        name:  e.target.value
      })
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
                <input type="text" onChange={this.handleOnChange} className="tasbih-name"/>
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
