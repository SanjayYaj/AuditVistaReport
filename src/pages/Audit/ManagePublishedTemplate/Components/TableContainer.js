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
import { Table, Row, Col, Button } from "reactstrap"
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
        <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`Search Audit...`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
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
  enableBtn,
  isShowingPageLength,
  paginationDiv,
  pagination,
  tableClass,
  theadClass,
  total_audit,
  published_count,
  non_published_count,
  filterStatus,
  sort
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
      {
        enableBtn &&
        <Row>
          <Col className="text-end">
            <div className="mb-1 ms-2">
              <div className="btn-group " role="group" aria-label="Basic radio toggle button group">
                <Link to={"/mngmtrtmplt"}><Button color={"dark"} className="btn-sm" outline={sort !== "enab"} onClick={() => filterStatus("enab")}  > Publish New Audit </Button></Link>
              </div>
            </div>
          </Col>
        </Row>
      }
 
      <Row className="mb-3">
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
    
        {
          filterStatus !== undefined &&
        (
          <Col sm="8" className="d-flex justify-content-end">
            <div className="button-items mb-1 ms-2 text-center">
              <div className="btn-group " role="group" aria-label="Basic radio toggle button group">
                <Button color={"dark"} className="btn-sm" outline={sort !== undefined} onClick={() => filterStatus(undefined)} > All &nbsp;{total_audit} </Button>
                <Button color={"success"} className="btn-sm" outline={sort !== "pub"} onClick={() => filterStatus('pub')} > Published Audits &nbsp;{published_count} </Button>
                <Button color={"danger"} className="btn-sm" outline={sort !== "non"} onClick={() => filterStatus('non')} >Unpublished Audits&nbsp;{non_published_count} </Button>
              </div>
            </div>
          </Col>
        )}
        {dynamicBtn && (
            <div className="text-sm-end">
         
                <Button onClick={() => { btnClick() }} className="btn-sm" type="button" outline color="primary">
                <i className="mdi mdi-plus-circle-outline me-1" />
                {btnName}
              </Button>             
            </div>
        
        )}
        {isAddCustList && (
          <Col sm="7" xxl="8">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className="table-responsive">
     
        {
           page.length === 0 ? (
            <div className="text-center">
              <label>No data found </label>
            </div>
          ) : (
            <Table {...getTableProps()} className={tableClass}>

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
          )}
      </div>



      {
        isPagination && (
          <Row className="justify-content-end align-items-center mt-2">
            {isShowingPageLength && (
              <div className="col-sm">
                <div className="text-muted">
                  Showing <span className="fw-semibold">{page.length}</span> of <span className="fw-semibold">{data.length}</span> entries
                </div>
              </div>
            )}
            <div className={paginationDiv} style={{ overflowX: 'auto', maxWidth: '500px', width: '100%' ,whiteSpace: 'nowrap', textAlign: 'right' }}>
              <ul className={pagination} style={{ display: 'inline-flex', listStyle: 'none' }} >
                <li className={`page-item ${!canPreviousPage ? "disabled" : ''}`}>
                  <Link to="#" className="page-link" onClick={previousPage}>
                    <i className="mdi mdi-chevron-left"></i>
                  </Link>
                </li>
                {pageOptions.map((item, key) => (
                  <React.Fragment key={key}>
                    <li className={pageIndex === item ? "page-item active" : "page-item"}>
                      <Link to="#" className="page-link" onClick={() => gotoPage(item)}>{item + 1}</Link>
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

      {/* {
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
      } */}
    </Fragment>
  )
}

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default TableContainer


