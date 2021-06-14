import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import db from "../Firebase/firebase.js";
import { Dropdown } from "react-bootstrap";
import "./modal.css";

import { updateSettings } from "../../action/action";
import { useSelector, useDispatch } from "react-redux";

const AddBody = props => {
  const [name, setName] = useState("Choose Tasbih");
  const [noOfTasbihs, setNoOfTasbih] = useState([]);
  const [tid, setTID] = useState("None");
  const userDeleted = props.userDeleted;

  const settings = useSelector(s => s.Settings);
  const dispach = useDispatch();

  const handleClose = () => {
    props.hideModal();
  };

  const handleAddData = () => {
    if (name !== "") {
      props.click(name, tid, noOfTasbihs.length);
      setName("");
    } else {
      alert("Select Tasbih First");
    }
  };

  const handleOnChange = (obj, e) => {
    e.preventDefault();

    var val = noOfTasbihs.filter(function(item) {
      return item.Name === e.target.text;
    });
    setName(e.target.text);
    console.log(val);
    setTID(val[0].ID);
  };

  useEffect(() => {
    let unSubs = db
      .collection("Tasbihs")
      .where("Visible", "==", true)
      .onSnapshot(
        snap => {
          var noOfTasbihs = snap.docs.map(doc => {
            return { ID: doc.id, Name: doc.data().Name };
          });

          dispach(
            updateSettings({
              totalTasbihsCount: noOfTasbihs.length
            })
          );
          setNoOfTasbih(noOfTasbihs);

          if (userDeleted) {
            unSubs();
          }
        },
        er => console.log(er)
      );
  }, []);

  return (
    <Modal show={props.showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Tasbih</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          <div className="add-tasbih-name" key="0">
            <div className="tasbih">
              {/* <select onChange={handleOnChange}>
                <option>Choose Tasbih</option>
                {noOfTasbihs.map(tasbih => {
                  var disable = props.displayedIds.filter(t => {
                    return t === tasbih.ID ? true : false;
                  });

                  return (
                    <option disabled={disable[0]} key={tasbih.ID}>
                      {tasbih.Name}
                    </option>
                  );
                })}
              </select> */}

              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {name}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {noOfTasbihs.map(tasbih => {
                    var disable = props.displayedIds.filter(t => {
                      return t === tasbih.ID ? true : false;
                    });

                    return (
                      <Dropdown.Item
                        onSelect={handleOnChange}
                        disabled={disable[0]}
                        key={tasbih.ID}
                      >
                        {tasbih.Name}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" className="save-btn" onClick={handleAddData}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBody;
