import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from "reactstrap";

const Breadcrumbs = ({
  title,
  isBackButtonEnable,
  gotoBack,
  enableButton,
  btnLabel1Style,
  btnLabel2Style,
  btnLabel1Fun,
  btnLabel2Fun,
  btnLabel1,
  btnLabel2,
  labelName
}) => {


  return (
    <React.Fragment>
      <Row className='my-3'>
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div className="mb-0 mt-2 m-2 font-size-14 fw-bold">{title}</div>
          </div>
        </Col>
        {isBackButtonEnable && (
          <Col className='d-flex align-items-center justify-content-end gap-1 mx-2'>
            {enableButton && (
              <>
                <button className={btnLabel1Style} onClick={btnLabel1Fun}>
                  {btnLabel1}
                </button>
                <button className={btnLabel2Style} onClick={btnLabel2Fun}>
                  {btnLabel2}
                </button>
              </>
            )}
            <button
              className='btn btn-outline-primary btn-sm'
              color="primary me-2"
              onClick={gotoBack}
            >
              {labelName} <i className="mdi mdi-arrow-left"></i>
            </button>
          </Col>
        )}
      </Row>
    </React.Fragment>
  );
};

Breadcrumbs.propTypes = {
  title: PropTypes.string.isRequired,
  isBackButtonEnable: PropTypes.bool,
  gotoBack: PropTypes.func,
  enableButton: PropTypes.bool,
  btnLabel1Style: PropTypes.string,
  btnLabel2Style: PropTypes.string,
  btnLabel1Fun: PropTypes.func,
  btnLabel2Fun: PropTypes.func,
  btnLabel1: PropTypes.string,
  btnLabel2: PropTypes.string,
  labelName: PropTypes.string,
};

export default Breadcrumbs;









// import React, { Component } from 'react';
// import PropTypes from 'prop-types'; // Import prop-types
// import { Row, Col, Breadcrumb, BreadcrumbItem, Button, } from "reactstrap";

// class Breadcrumbs extends Component {

//   render() {
//     const { enableButton, btnLabel1Style,btnLabel2Style, btnLabel1Fun, btnLabel2Fun } = this.props
//     return (
//       <React.Fragment>
//         <Row className='mb-1'>
//           <Col>
//             <div className="d-flex align-items-center justify-content-between">
//               <div className="mb-0 mt-2 m-2 font-size-14 fw-bold">{this.props.title}</div>
//             </div>
//           </Col>
//           {
//             this.props.isBackButtonEnable &&
//             <Col className='d-flex align-items-center justify-content-end gap-1 mx-2'>
//               {enableButton &&
//                 <>
//                   <button className={btnLabel1Style} onClick={() => btnLabel1Fun()}>{this.props.btnLabel1} </button>
//                   <button className={btnLabel2Style} onClick={() => btnLabel2Fun()}>{this.props.btnLabel2}</button>
//                 </>
//               }
//               <button className='btn btn-outline-primary btn-sm' color="primary me-2" onClick={() => this.props.gotoBack()}>{this.props.labelName} <i className="mdi mdi-arrow-left"></i></button>
//             </Col>
//           }
//         </Row>
//       </React.Fragment>
//     );
//   }
// }

// Breadcrumbs.propTypes = {
//   title: PropTypes.string.isRequired,
//   isBackButtonEnable: PropTypes.bool,
//   gotoBack: PropTypes.func,
// };

// export default Breadcrumbs;















// import React from "react"
// import PropTypes from 'prop-types'
// import { Link } from "react-router-dom"
// import { Row, Col, BreadcrumbItem } from "reactstrap"

// const Breadcrumb = props => {
//   return (
//     <Row>
//       <Col className="col-12">
//         <div className="page-title-box d-sm-flex align-items-center justify-content-between">
//           <h4 className="mb-sm-0 font-size-18">{props.breadcrumbItem}</h4>
//           <div className="page-title-right">
//             <ol className="breadcrumb m-0">
//               <BreadcrumbItem>
//                 <Link to="#">{props.title}</Link>
//               </BreadcrumbItem>
//               <BreadcrumbItem active>
//                 <Link to="#">{props.breadcrumbItem}</Link>
//               </BreadcrumbItem>
//             </ol>
//           </div>
//         </div>
//       </Col>
//     </Row>
//   )
// }

// Breadcrumb.propTypes = {
//   breadcrumbItem: PropTypes.string,
//   title: PropTypes.string
// }

// export default Breadcrumb
