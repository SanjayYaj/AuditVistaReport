import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Col,
  Badge
} from "reactstrap";

const ReviewCard = (props) => {

  useEffect(() => {
    console.log("Component mounted",props);
  }, []);

  return (
    <Col xxl="3" xl="4" lg="4" md="6" sm="12" className="mb-4">
      <Card
        className="shadow-sm h-100"
        style={{
          borderRadius: "12px",
          border: "1px solid #34c38f",
          overflow: "hidden",
        }}
      >
        {/* Header or Icon Section */}
        <div className="bg-light p-3 d-flex align-items-center">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "8px",
              backgroundColor: "rgb(243, 246, 251)",
            }}
          >
            {/* Optional Icon */}
            <i className="bx bxs-file text-success font-size-18" />
          </div>
        </div>

        {/* Card Content */}
        <CardBody className="pt-2 pb-2">
          <h5 className="font-size-15 fw-semibold mb-2 text-uppercase text-primary">
           {props.index +1}{" ) "} {props.data.mode}
          </h5>
          <p
            className="text-muted font-size-12 mb-0"
            style={{
              maxHeight: "3em",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Shift count : {props.data?.scheduled_shift?.length}
          </p>
        </CardBody>

        {/* Footer Actions */}
        <CardFooter
          className="bg-white d-flex justify-content-between align-items-center p-2"
          style={{ borderTop: "1px solid #f1f1f1" }}
        >
          <div className="d-flex align-items-center gap-2" onClick={()=>{
            props.showDetailedInfo(props.data,true)
          }}>
            <Link to="#" className="btn btn-sm btn-soft-info">
              <i className="bx bx-edit-alt" />
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Col>
  );
};

export default ReviewCard;










// import React, { useEffect } from 'react'
// import { Link } from "react-router-dom";
// import {
//   Card,
//   CardBody,
//   CardFooter,
//   Col,
//   UncontrolledTooltip,
//   Badge,
// } from "reactstrap";
// const ReviewCard = () => {

//     useEffect(()=>{
//         console.log("llll")
//     },[])

//   return (
//       <Col xxl="3" xl="3" lg="3" md="4" sm="6" className="">
//  <Card
//         className="shadow-sm h-100"
//         style={{
//           borderRadius: "10px",
//           border: "1px solid #34c38f" ,
//           overflow: "hidden",
//         }}
//       >
//         <div className="bg-light p-2 d-flex align-items-center">
//           <div
//             className="ms-1 d-flex align-items-center justify-content-center"
//             style={{
//               height: "35px",
//               width: "50px",
//               borderRadius: "10%",
//               background: "rgb(243, 246, 251)",
//             }}
//           >
            
//           </div>
//           </div>
//           <CardBody className="p-2">
//           <h5 className="font-size-14 fw-bold mb-1">
//           <div className={ "textInfo textUppercase" }>{"templateNameCamelCase"}</div>
//           </h5>
//           <div 
//            className="card-text text-muted font-size-10 mb-1"
//             style={{ maxWidth: "100%", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer" }}>
//             {/* {truncateText("docItem.template_info", 120)} */}
//           </div>


//           </CardBody>
//             <CardFooter className="bg-white d-flex justify-content-between align-items-center p-2" style={{ borderTop: "1px solid #f1f1f1" }}>
//                     <span className={`font-size-11 adge badge-soft-success`}>
//                       Checkpoints: 
//                     </span>
//                     <div className="d-flex gap-2">
//                       <Link to="#" className="btn btn-sm btn-soft-info" >
//                         <i className="bx bx-edit-alt" />
//                       </Link>
//                         Rename Template
          
//                     </div>
//                   </CardFooter>

//       </Card>

//         </Col>
//   )
// }
// export default ReviewCard
