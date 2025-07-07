import React, { Fragment } from "react"
import PropTypes from "prop-types"
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useExpanded,
  usePagination,
} from "react-table"
import { Table, Row, Col, Button, Label } from "reactstrap"
import JobListGlobalFilter from "./GlobalSearchFilter";
import { Link } from "react-router-dom"

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isJobListGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <React.Fragment>
      <Col sm="4">
        <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`Search Location / Asset Name...`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
      </Col>
      {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}
    </React.Fragment>
  )
}

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isJobListGlobalFilter,
  isAddOptions,
  btnClick,
  btnName,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  customPageSizeOptions,
  iscustomPageSizeOptions,
  isPagination,
  dynamicBtn,
  isShowingPageLength,
  paginationDiv,
  pagination,
  tableClass,
  theadClass,
  total_audit,
  not_started_count,
  in_progress_count,
  completed_count,
  submitted_count,
  reviewed_count,
  filterStatus,
  onClickLocation,
  onClickChangeAuditEndDate,
  publishedAuditData
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      // defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: [
          // {
          //   desc: true,
          // },
        ],
      },
    },
    useGlobalFilter,
    // useFilters,
    useSortBy,
    useExpanded,
    usePagination
  )

  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
  }

  const onChangeInSelect = event => {
    setPageSize(Number(event.target.value))
  }

  return (
    <Fragment>
      <Row className="mb-2">
        {iscustomPageSizeOptions &&
          <Col md={customPageSizeOptions ? 2 : 1}>
            <select
              className="form-select"
              value={pageSize}
              onChange={onChangeInSelect}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        }

        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            isJobListGlobalFilter={isJobListGlobalFilter}
          />
        )}
        {/* {(
          <Col sm="4" className="d-flex justify-content-center align-items-center">
            <div className="button-items text-end">
              <div className="btn-group " role="group" aria-label="Basic radio toggle button group">
                <input type="radio" className="btn-check" name="btnradio1" id="btnradio0" autoComplete="off" defaultChecked onClick={() => { filterStatus('All') }} />
                <label className="btn btn-outline-dark btn-sm" htmlFor="btnradio0">All&nbsp;{total_audit}</label>

                <input type="radio" className="btn-check" name="btnradio1" id="btnradio1" autoComplete="off" onClick={() => { filterStatus('Not started') }} />
                <label className="btn btn-outline-secondary btn-sm" htmlFor="btnradio1">Not started&nbsp;{not_started_count}</label>

                <input type="radio" className="btn-check" name="btnradio1" id="btnradio2" autoComplete="off" onClick={() => filterStatus('In progress')} />
                <label className="btn btn-outline-warning btn-sm" htmlFor="btnradio2">In progress&nbsp;{in_progress_count}</label>

                <input type="radio" className="btn-check" name="btnradio1" id="btnradio3" autoComplete="off" onClick={() => filterStatus('Completed')} />
                <label className="btn btn-outline-success btn-sm" htmlFor="btnradio3">Completed&nbsp;{completed_count}</label>

                <input type="radio" className="btn-check" name="btnradio1" id="btnradio4" autoComplete="off" onClick={() => filterStatus('Submitted')} />
                <label className="btn btn-outline-info btn-sm" htmlFor="btnradio4">Submitted&nbsp;{submitted_count}</label>
                <input type="radio" className="btn-check" name="btnradio1" id="btnradio5" autoComplete="off" onClick={() => filterStatus('Reviewed')} />
                <label className="btn btn-outline-pink btn-sm" htmlFor="btnradio5">Reviewed&nbsp;{reviewed_count}</label>

              </div>
            </div>
          </Col>
        )} */}
        {
          
          <Col sm="4" className="d-flex justify-content-end align-items-center">
            <div>
            {onClickLocation &&
              <Button className="btn-sm me-2" color={"primary"} onClick={() => { onClickLocation() }} outline >Location</Button>}
              {/* <Button className="btn-sm me-2" color={"primary"} outline onClick={() => { onClickChangeAuditEndDate() }}>Change Audit End date</Button> */}
            </div>
          </Col>
        }

      </Row>


      <Row className="my-2">
        <Col md={3}>
          <Label className="text-primary">{publishedAuditData.template_name}</Label>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <div className="button-items text-end">
            <div className="btn-group " role="group" aria-label="Basic radio toggle button group">
              <input type="radio" className="btn-check" name="btnradio1" id="btnradio0" autoComplete="off" defaultChecked onClick={() => { filterStatus('All') }} />
              <label className="btn btn-outline-dark btn-sm" htmlFor="btnradio0">All&nbsp;{total_audit}</label>

              <input type="radio" className="btn-check" name="btnradio1" id="btnradio1" autoComplete="off" onClick={() => { filterStatus('Not started') }} />
              <label className="btn btn-outline-secondary btn-sm" htmlFor="btnradio1">Not started&nbsp;{not_started_count}</label>

              <input type="radio" className="btn-check" name="btnradio1" id="btnradio2" autoComplete="off" onClick={() => filterStatus('In progress')} />
              <label className="btn btn-outline-warning btn-sm" htmlFor="btnradio2">In progress&nbsp;{in_progress_count}</label>

              <input type="radio" className="btn-check" name="btnradio1" id="btnradio3" autoComplete="off" onClick={() => filterStatus('Completed')} />
              <label className="btn btn-outline-success btn-sm" htmlFor="btnradio3">Completed&nbsp;{completed_count}</label>

              <input type="radio" className="btn-check" name="btnradio1" id="btnradio4" autoComplete="off" onClick={() => filterStatus('Submitted')} />
              <label className="btn btn-outline-info btn-sm" htmlFor="btnradio4">Submitted&nbsp;{submitted_count}</label>
              <input type="radio" className="btn-check" name="btnradio1" id="btnradio5" autoComplete="off" onClick={() => filterStatus('Reviewed')} />
              <label className="btn btn-outline-pink btn-sm" htmlFor="btnradio5">Reviewed&nbsp;{reviewed_count}</label>

            </div>
          </div>
        </Col>
      </Row>

{
  data.length >0 ?
  <div className="table-responsive">
        <Table {...getTableProps()} className={tableClass}>
          {/* <thead className={theadClass}>
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id} className={column.isSort ? "sorting" : ''}>
                    <div className="m-0" {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead> */}
          <thead className={theadClass}>
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id} className={column.isSort ? "sorting" : ''} width={column.width}>
                    <div className="m-0" >
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row)
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr>
                    {row.cells.map(cell => {
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      )
                    })}
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </Table>
      </div>
      :
      <div className="text-center">
      <label>No data found </label>
  </div>


}
      

      {
        isPagination && (
          <Row className="justify-content-between align-items-center">
            {isShowingPageLength && <div className="col-sm">
              <div className="text-muted">Showing <span className="fw-semibold">{page.length}</span> of <span className="fw-semibold">{data.length}</span> entries</div>
            </div>}
            <div className={paginationDiv}>
              <ul className={pagination}>
                <li className={`page-item ${!canPreviousPage ? "disabled" : ''}`}>
                  <Link to="#" className="page-link" onClick={previousPage}>
                    <i className="mdi mdi-chevron-left"></i>
                  </Link>
                </li>
                {pageOptions.map((item, key) => (
                  <React.Fragment key={key}>
                    <li className={pageIndex === item ? "page-item active" : "page-item"}>
                      <Link to="#" className="page-link" onClick={() => {gotoPage(item);console.log(item,'item')}}>{item + 1}</Link>
                    </li>
                  </React.Fragment>
                ))}
                <li className={`page-item ${!canNextPage ? "disabled" : ''}`}>
                  <Link to="#" className="page-link" onClick={nextPage}>
                    <i className="mdi mdi-chevron-right"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        )
      }
    </Fragment>
  )
}

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default TableContainer












// import React, { Fragment } from "react"
// import PropTypes from "prop-types"
// import {
//   useTable,
//   useGlobalFilter,
//   useAsyncDebounce,
//   useSortBy,
//   useExpanded,
//   usePagination,
// } from "react-table"
// import { Table, Row, Col, Button, Label } from "reactstrap"
// import JobListGlobalFilter from "./GlobalSearchFilter";
// import { Link } from "react-router-dom"

// // Define a default UI for filtering
// function GlobalFilter({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter,
//   isJobListGlobalFilter,
// }) {
//   const count = preGlobalFilteredRows.length
//   const [value, setValue] = React.useState(globalFilter)
//   const onChange = useAsyncDebounce(value => {
//     setGlobalFilter(value || undefined)
//   }, 200)

//   return (
//     <React.Fragment>
//       <Col sm="4">
//         <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`Search Location / Asset Name...`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
//       </Col>
//       {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}
//     </React.Fragment>
//   )
// }

// const TableContainer = ({
//   columns,
//   data,
//   isGlobalFilter,
//   isJobListGlobalFilter,
//   isAddOptions,
//   btnClick,
//   btnName,
//   isAddUserList,
//   handleOrderClicks,
//   handleUserClick,
//   handleCustomerClick,
//   isAddCustList,
//   customPageSize,
//   customPageSizeOptions,
//   iscustomPageSizeOptions,
//   isPagination,
//   dynamicBtn,
//   isShowingPageLength,
//   paginationDiv,
//   pagination,
//   tableClass,
//   theadClass,
//   total_audit,
//   not_started_count,
//   in_progress_count,
//   completed_count,
//   submitted_count,
//   reviewed_count,
//   filterStatus,
//   onClickLocation,
//   onClickChangeAuditEndDate,
//   publishedAuditData
// }) => {
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state,
//     preGlobalFilteredRows,
//     setGlobalFilter,
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data,
//       // defaultColumn: { Filter: DefaultColumnFilter },
//       initialState: {
//         pageIndex: 0,
//         pageSize: customPageSize,
//         sortBy: [
//           // {
//           //   desc: true,
//           // },
//         ],
//       },
//     },
//     useGlobalFilter,
//     // useFilters,
//     useSortBy,
//     useExpanded,
//     usePagination
//   )

//   const generateSortingIndicator = column => {
//     return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
//   }

//   const onChangeInSelect = event => {
//     setPageSize(Number(event.target.value))
//   }

//   return (
//     <Fragment>
//       <Row className="mb-2">
//         {iscustomPageSizeOptions &&
//           <Col md={customPageSizeOptions ? 2 : 1}>
//             <select
//               className="form-select"
//               value={pageSize}
//               onChange={onChangeInSelect}
//             >
//               {[10, 20, 30, 40, 50].map(pageSize => (
//                 <option key={pageSize} value={pageSize}>
//                   Show {pageSize}
//                 </option>
//               ))}
//             </select>
//           </Col>
//         }

//         {isGlobalFilter && (
//           <GlobalFilter
//             preGlobalFilteredRows={preGlobalFilteredRows}
//             globalFilter={state.globalFilter}
//             setGlobalFilter={setGlobalFilter}
//             isJobListGlobalFilter={isJobListGlobalFilter}
//           />
//         )}
      
//         {
          
//           <Col sm="4" className="d-flex justify-content-end align-items-center">
//             <div>
//             {onClickLocation &&
//               <Button className="btn-sm me-2" color={"primary"} onClick={() => { onClickLocation() }} outline >Location</Button>}
//             </div>
//           </Col>
//         }

//       </Row>


//       {/* <Row className="my-2">
//         <Col md={3}>
//           <Label className="text-primary">{publishedAuditData?.template_name}</Label>
//         </Col>
//         <Col className="d-flex justify-content-end align-items-center">
//           <div className="button-items text-end">
//             <div className="btn-group " role="group" aria-label="Basic radio toggle button group">
//               <input type="radio" className="btn-check" name="btnradio1" id="btnradio0" autoComplete="off" defaultChecked onClick={() => { filterStatus('All') }} />
//               <label className="btn btn-outline-dark btn-sm" htmlFor="btnradio0">All&nbsp;{total_audit}</label>

//               <input type="radio" className="btn-check" name="btnradio1" id="btnradio1" autoComplete="off" onClick={() => { filterStatus('Not started') }} />
//               <label className="btn btn-outline-secondary btn-sm" htmlFor="btnradio1">Not started&nbsp;{not_started_count}</label>

//               <input type="radio" className="btn-check" name="btnradio1" id="btnradio2" autoComplete="off" onClick={() => filterStatus('In progress')} />
//               <label className="btn btn-outline-warning btn-sm" htmlFor="btnradio2">In progress&nbsp;{in_progress_count}</label>

//               <input type="radio" className="btn-check" name="btnradio1" id="btnradio3" autoComplete="off" onClick={() => filterStatus('Completed')} />
//               <label className="btn btn-outline-success btn-sm" htmlFor="btnradio3">Completed&nbsp;{completed_count}</label>

//               <input type="radio" className="btn-check" name="btnradio1" id="btnradio4" autoComplete="off" onClick={() => filterStatus('Submitted')} />
//               <label className="btn btn-outline-info btn-sm" htmlFor="btnradio4">Submitted&nbsp;{submitted_count}</label>
//               <input type="radio" className="btn-check" name="btnradio1" id="btnradio5" autoComplete="off" onClick={() => filterStatus('Reviewed')} />
//               <label className="btn btn-outline-pink btn-sm" htmlFor="btnradio5">Reviewed&nbsp;{reviewed_count}</label>

//             </div>
//           </div>
//         </Col>
//       </Row> */}

//       {
//         console.log("page",headerGroups,data)
//       }



//       <div className="table-responsive">
//         <Table {...getTableProps()} className={tableClass}>
//           <thead className={theadClass}>
//             {headerGroups.map(headerGroup => (
//               <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
//                 {headerGroup.headers.map(column => (
//                   <th key={column.id} className={column.isSort ? "sorting" : ''} width={column.width}>
//                     {
//                       column.isSort ?
//                         <div className="m-0" {...column.getSortByToggleProps()}>
//                           {column.render("Header")}
//                         </div> :
//                         <div className="m-0" >
//                           {column.render("Header")}
//                         </div>
//                     }

//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>

//           <tbody {...getTableBodyProps()}>
//             {page.map(row => {
//               prepareRow(row)
//               return (
//                 <Fragment key={row.getRowProps().key}>
//                   <tr>
//                     {row.cells.map(cell => {
//                       return (
//                         <td key={cell.id} {...cell.getCellProps()}>
//                           {cell.render("Cell")}
//                         </td>
//                       )
//                     })}
//                   </tr>
//                 </Fragment>
//               )
//             })}
//           </tbody>
//         </Table>
//       </div>







//       {/* {
//         data.length > 0 && page.length > 0 ?
//           <div className="table-responsive">
//             <Table {...getTableProps()} className={tableClass}>
//               <thead className={theadClass}>
//                 {headerGroups.map(headerGroup => (
//                   <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map(column => (
//                       <th key={column.id} className={column.isSort ? "sorting" : ''} width={column.width}>
//                         {
//                           column.isSort ?
//                             <div className="m-0" {...column.getSortByToggleProps()}>
//                               {column.render("Header")}
//                             </div> :
//                             <div className="m-0" >
//                               {column.render("Header")}
//                             </div>
//                         }

//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>

//               <tbody {...getTableBodyProps()}>
//                 {page.map(row => {
//                   prepareRow(row)
//                   return (
//                     <Fragment key={row.getRowProps().key}>
//                       <tr>
//                         {row.cells.map(cell => {
//                           return (
//                             <td key={cell.id} {...cell.getCellProps()}>
//                               {cell.render("Cell")}
//                             </td>
//                           )
//                         })}
//                       </tr>
//                     </Fragment>
//                   )
//                 })}
//               </tbody>
//             </Table>
//           </div>
//           :
//           <div className="text-center">
//             <label>No data found </label>
//           </div>
//       } */}
      

//       {
//         isPagination && (
//           <Row className="justify-content-between align-items-center">
//             {isShowingPageLength && <div className="col-sm">
//               <div className="text-muted">Showing <span className="fw-semibold">{page.length}</span> of <span className="fw-semibold">{data.length}</span> entries</div>
//             </div>}
//             <div className={paginationDiv}>
//               <ul className={pagination}>
//                 <li className={`page-item ${!canPreviousPage ? "disabled" : ''}`}>
//                   <Link to="#" className="page-link" onClick={previousPage}>
//                     <i className="mdi mdi-chevron-left"></i>
//                   </Link>
//                 </li>
//                 {pageOptions.map((item, key) => (
//                   <React.Fragment key={key}>
//                     <li className={pageIndex === item ? "page-item active" : "page-item"}>
//                       <Link to="#" className="page-link" onClick={() => {gotoPage(item);console.log(item,'item')}}>{item + 1}</Link>
//                     </li>
//                   </React.Fragment>
//                 ))}
//                 <li className={`page-item ${!canNextPage ? "disabled" : ''}`}>
//                   <Link to="#" className="page-link" onClick={nextPage}>
//                     <i className="mdi mdi-chevron-right"></i>
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </Row>
//         )
//       }
//     </Fragment>
//   )
// }

// TableContainer.propTypes = {
//   preGlobalFilteredRows: PropTypes.any,
// }

// export default TableContainer