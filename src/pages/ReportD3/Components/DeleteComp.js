import PropTypes from 'prop-types';
import React from "react";
import { Modal, ModalBody, Label, Row, Col, Input } from "reactstrap";

const DeleteModal = ({ show, onDeleteClick, onCloseClick, mode, handleSubmit, topicError, topicMsg, topicName, setTopicName , data }) => {

//   const onSubmit = (e) => {
//     e.preventDefault();
//     handleSubmit(topicName);
//   };
console.log('data :>> ', data);

  return (
    <Modal size="md" isOpen={show} toggle={onCloseClick} centered={true}>
    <div className="modal-content">
      <ModalBody className="px-4 py-5 text-center">
        <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3" />
            <div className="avatar-sm mb-4 mx-auto">
              <div className="avatar-title bg-primary text-primary bg-opacity-10 font-size-20 rounded-3">
                <i className="mdi mdi-trash-can-outline"></i>
              </div>
            </div>
            <p className="text-muted font-size-16 mb-4">Are you sure want to permanently delete <strong style={{ color:'#d33'}}>{data?.name }</strong> ?</p>

            <div className="hstack gap-2 justify-content-center mb-0">
              <button type="button" className="btn btn-danger" onClick={onDeleteClick}>Delete Now</button>
              <button type="button" className="btn btn-secondary" onClick={onCloseClick}>Close</button>
            </div>
            </ModalBody>
      </div>
    </Modal>

    // <Modal size="md" isOpen={show} toggle={onCloseClick} centered={true}>
    //   <div className="modal-content">
    //     <ModalBody className="px-4 py-5 text-center">
    //       <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3" />
    //       {mode === undefined ? (
    //         <>
    //           <div className="avatar-sm mb-4 mx-auto">
    //             <div className="avatar-title bg-primary text-primary bg-opacity-10 font-size-20 rounded-3">
    //               <i className="mdi mdi-trash-can-outline"></i>
    //             </div>
    //           </div>
    //           <p className="text-muted font-size-16 mb-4">Are you sure you want to permanently delete.</p>

    //           <div className="hstack gap-2 justify-content-center mb-0">
    //             <button type="button" className="btn btn-danger" onClick={onDeleteClick}>Delete Now</button>
    //             <button type="button" className="btn btn-secondary" onClick={onCloseClick}>Close</button>
    //           </div>
    //         </>
    //       ) : (
    //         <>
    //           <form className="form-horizontal" onSubmit={onSubmit}>
    //             <Row className="mb-4">
    //               <Col>
    //                 <div className="form-group">
    //                   <div className='text-start'>
    //                   <Label className="form-label">
    //                     Topic Name :
    //                   </Label>
    //                   </div>
    //                   <Input
    //                     name="content_name"
    //                     className="form-control"
    //                     placeholder="Enter Content Name"
    //                     type="text"
    //                     value={topicName}
    //                     onChange={(e) => setTopicName(e.target.value)}
    //                   />
    //                   {topicMsg !=="" && <div className='text-start'><h5 style={{fontSize:"smaller"}} className={`text-${topicError} mt-2`}>{topicMsg}</h5></div>}
    //                 </div>
    //               </Col>
    //             </Row>
    //             <div className="text-end mt-1">
    //               <button type="submit" className="btn btn-primary">Submit</button>
    //             </div>
    //           </form>
    //         </>
    //       )}
    //     </ModalBody>
    //   </div>
    // </Modal>
  );
};

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any,
//   mode: PropTypes.number.isRequired,
//   handleSubmit: PropTypes.func.isRequired,
};

export default DeleteModal;