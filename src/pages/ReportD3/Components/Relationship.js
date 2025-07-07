import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label } from 'reactstrap';
import { setState } from 'Slice/reportd3/treedataSlice';

import { retriveClnKeys } from '../../../Slice/reportd3/reportslice'
import { clone } from 'lodash';


const RelationshipModal = ({ isOpen, toggle, collections, onSaveRelationship , managerelationshipToggle , relationshipsAdded }) => {
  const [sourceCollection, setSourceCollection] = useState('');
  const [sourceField, setSourceField] = useState('');
  const [targetCollection, setTargetCollection] = useState('');
  const [targetField, setTargetField] = useState('');

  const [sourceFieldOptions, setSourceFieldOptions] = useState([]);
  const [targetFieldOptions, setTargetFieldOptions] = useState([]);

  const [relationships, setRelationships] = useState(relationshipsAdded || []);

  const [ managerelationship, setManageRelationship] = useState(managerelationshipToggle);
  const dispatch = useDispatch();
  const authInfo = useSelector((state) => state.auth);

console.log('managerelationshipToggle :>> ', managerelationshipToggle , relationshipsAdded);
  useEffect(() => {
    if (isOpen) {
      dispatch(setState({ mainToggle: true }));
    }
  }
    , []);


    useEffect(() => {
      setManageRelationship(managerelationshipToggle);
      setRelationships(relationshipsAdded || []);
    }, [managerelationshipToggle , relationshipsAdded]);
    
    
  const handleSave = () => {
    // Add the current selection if all fields are selected
    if (sourceCollection && sourceField && targetCollection && targetField) {
      const newRelationship = {
        sourceCollection,
        sourceField,
        targetCollection,
        targetField
      };
      setRelationships(prev => {
        const updated = [...prev, newRelationship];
        console.log('relationships :>> ', updated);
         // onSaveRelationship(updated);
        // Do your final save here, e.g., onSaveRelationship(updated);
        toggle();
        setManageRelationship(true);
        // onSaveRelationship(updated);
        return updated;
      });
    } else {
      // Just save what's already there
      console.log('relationships :>> ', relationships);
      toggle();
    }
  };




  const SelectCln = (e) => {
    const selectedCollection = e.target.value;
    setSourceCollection(selectedCollection);

    // Reset source field when collection changes
    setSourceField("");
    getFieldsName({ selectedCollection }, "source");

    // Clear targetCollection if it's the same
    if (selectedCollection === targetCollection) {
      setTargetCollection("");
      setTargetField("");
      setTargetFieldOptions([]);
    }
  };

  const selectTarcln = (e) => {
    const selectedCollection = e.target.value;
    setTargetCollection(selectedCollection);

    // Reset target field when collection changes
    setTargetField("");
    getFieldsName({ selectedCollection }, "target");
  };


  const getFieldsName = async (value, type) => {
    if (value !== undefined) {
      try {
        const response = await dispatch(retriveClnKeys(value, authInfo));
        console.log('response :>> ', response);
        if (response.status === 200) {
          if (type === "source") {
            setSourceFieldOptions(response.data.key_names);
          } else if (type === "target") {
            setTargetFieldOptions(response.data.key_names);
          }
        } else {
          console.error(`Failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    }
  };

  const handleAddRelationship = () => {
    // if (sourceCollection && sourceField && targetCollection && targetField) {
    //   setRelationships(prev => [
    //     ...prev,
    //     {
    //       sourceCollection,
    //       sourceField,
    //       targetCollection,
    //       targetField
    //     }
    //   ]);

    //   onSaveRelationship(updated);
    //   // Reset the form
      // setSourceCollection('');
      // setSourceField('');
      // setTargetCollection('');
      // setTargetField('');
    // }

    if (sourceCollection && sourceField && targetCollection && targetField) {
      const newRelationship = {
        sourceCollection,
        sourceField,
        targetCollection,
        targetField,
      };
  
      setRelationships((prev) => {
        const updated = [...prev, newRelationship];
        onSaveRelationship(updated);  // Pass updated list to parent or context
        return updated;
      });
  
      // Optionally clear fields if needed:
      setSourceCollection('');
      setSourceField('');
      setTargetCollection('');
      setTargetField('');
    }



  };



  const manageToggle = () => {
    setManageRelationship(!managerelationship);
    onSaveRelationship(relationships);
  }



  const handleDeleteRelationship = (indexToDelete) => {
    const updated = relationships.filter((_, idx) => idx !== indexToDelete);
    setRelationships(updated);
  };



  return (
    <div>
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Create Relationship</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <Label>Source Collection</Label>
          <select className="form-control" name="source" value={sourceCollection} onChange={(e) => SelectCln(e)}>
            <option value="">Select Collection</option>
            {collections.map((col, i) => (
              <option key={i} value={col} >{col}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <Label>Source Field</Label>

          <select className="form-control" name="sourceField" value={sourceField} onChange={(e) => setSourceField(e.target.value)} >
            <option value="">Select Field</option>
            {sourceFieldOptions.map((val, i) => (
              <option key={i} value={val.name} >{val.name}</option>
            ))}
          </select>

        </div>

        <div className="mb-3">
          <Label>Target Collection</Label>
          <select className="form-control" value={targetCollection} onChange={(e) => selectTarcln(e)}>
            <option value="">Select Collection</option>
            {collections.filter((col) => col !== sourceCollection).map((col, i) => (
              <option key={i} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <Label>Target Field</Label>

          <select className="form-control" name="sourceField" value={targetField} onChange={(e) => setTargetField(e.target.value)} >
            <option value="">Select Field</option>
            {targetFieldOptions.map((val, i) => (
              <option key={i} value={val.name} >{val.name}</option>
            ))}
          </select>

        {
        ( sourceCollection && sourceField && targetCollection && targetField) ?
           <Button color="success mt-2" onClick={handleAddRelationship}>
            + Add New Relationship
          </Button>
          :
          null}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={handleSave}>Save Relationship</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>



    {/* Modal for listing relationships */}


    <Modal isOpen={managerelationship} toggle={manageToggle} backdrop="static" modalClassName="custom-relationship-modal">
  <ModalHeader toggle={manageToggle}>Manage Relationship</ModalHeader>
  <ModalBody>
    {relationships?.length > 0 ? (
      <div className="table-responsive fixed-header-table">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>From Collection (Field)</th>
              <th></th>
              <th>To Collection (Field)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {relationships.map((rel, index) => (
              <React.Fragment key={index}>
                {/* Highlighted Relationship Row */}
                <tr className="table-active bg-secondary">
                  <td colSpan="5" className="text-left fw-bold text-primary">
                    {rel.sourceField} <i className="bi bi-arrow-right-short"></i> {rel.targetField}
                  </td>
                </tr>

                {/* Collection Details Row */}
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    <span className="badge bg-secondary">{rel.sourceCollection}</span>
                    <div className="text-muted small">  (  {rel.sourceField}  )</div>
                  </td>
                  <td className="text-center">
                    <i className="bi bi-arrow-right text-info fs-4" />
                  </td>
                  <td>
                    <span className="badge bg-secondary">{rel.targetCollection}</span>
                    <div className="text-muted small">( {rel.targetField}  )</div>
                  </td>
                  <td>
                    <Button color="danger" size="sm" onClick={() => handleDeleteRelationship(index)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-muted">No relationships added yet.</p>
    )}
  </ModalBody>

  <ModalFooter>
    <Button color="primary" onClick={() => {
      toggle();
      setSourceCollection('');
      setSourceField('');
      setTargetCollection('');
      setTargetField('');
    }}>Add Relationship</Button>
    <Button color="secondary" onClick={manageToggle}>Cancel</Button>
  </ModalFooter>
</Modal>





    {/* <Modal isOpen={managerelationship} toggle={ manageToggle} backdrop="static" modalClassName="custom-relationship-modal">
  <ModalHeader toggle={manageToggle}>Manage Relationship</ModalHeader>
  <ModalBody>
    {relationships?.length > 0 ? (
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="thead-light">
            <tr>
              <th>No</th>
              <th>Source Collection</th>
              <th>Source Field</th>
              <th>Target Collection</th>
              <th>Target Field</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {relationships.map((rel, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{rel.sourceCollection}</td>
                <td>{rel.sourceField}</td>
                <td>{rel.targetCollection}</td>
                <td>{rel.targetField}</td>
                <td>
                  <Button color="danger" size="sm" onClick={() => handleDeleteRelationship(index)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-muted">No relationships added yet.</p>
    )}
  </ModalBody>

  <ModalFooter>
    <Button color="primary" onClick={()=> {toggle();  setSourceCollection('');
      setSourceField('');
      setTargetCollection('');
      setTargetField('');
       }}>Add Relationship</Button>
    <Button color="secondary" onClick={manageToggle}>Cancel</Button>
  </ModalFooter>
</Modal> */}




    </div>
  );
};

export default RelationshipModal;
