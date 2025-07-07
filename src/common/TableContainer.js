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
import JobListGlobalFilter from "../components/Common/GlobalSearchFilter";
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
      <Col xxl={3} lg={6}>
        <input type="search" className="form-control md-3" id="search-bar-0" value={value || ""} placeholder={`Search...`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
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
  audit_pbd_name,
  labelSelected,
  labelData,
  showSelect,
  navigateto,
  addedUsers
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
      initialState: {
        pageIndex: sessionStorage.getItem("currentPageIndex") ? Number(sessionStorage.getItem("currentPageIndex")) : 0,
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
      <Row className="mb-3">
        {iscustomPageSizeOptions &&
          <Col  md={customPageSizeOptions ? 4 : 6} xxl={3} lg={6}>
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
        {showSelect && showSelect !== undefined &&
          <Col md={showSelect && showSelect !== undefined ? 4 : 6} xxl={3} lg={6}>
            <div className="select-container me-2">
              <select
                className="form-select form-control"
                onChange={(e) => labelSelected(e)}
              >
                <option disabled value="">Select User Group</option>
                <option value="all">All</option>
                {labelData?.map((data, idx) => (
                  <option value={idx} key={"lbl" + idx}>
                    {data.label_name}
                  </option>
                ))}
              </select>
            </div>
          </Col>
        }

        {showSelect && showSelect !== undefined &&
          <>
            <Col>
            <div className="d-flex justify-content-end">
              <Button onClick={(userData, mode) => { navigateto(userData, mode) }} className="btn-sm d-flex align-items-center" color="primary" type="button">
                <i className="bx bx-list-plus me-1" style={{ fontSize: '20px' }} /> {'Add New User'}
              </Button>
            </div>
            </Col>
          </>
        }


        {isAddOptions && (
          <Col sm="7" xxl="8">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
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

        {audit_pbd_name !== undefined &&
          <Col style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', width: '100%', justifyContent: 'end', alignItems: 'center' }}>
            <div className="text-sm-end" >
              <h6 className="text-primary">{audit_pbd_name}</h6>
            </div>
          </Col>
        }


      </Row>
      {
        data.length > 0 && page.length >0?
          <div className="table-responsive">
            <Table {...getTableProps()} className={tableClass}>
              <thead className={theadClass}>
                {headerGroups?.map(headerGroup => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th key={column.id} className={column.isSort ? "sorting" : ''}>
                        <div className="m-0" >
                          {column.render("Header")}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page?.map(row => {
                  prepareRow(row)
                  const userIdx = addedUsers?.some(user => user._id === row.original._id);
                  return (
                    <Fragment key={row.getRowProps().key}>
                      <tr>
                        {row.cells?.map(cell => {
                          return (
                            <td key={cell.id} {...cell.getCellProps()} style={{ background: userIdx ? 'lemonchiffon' : '', }}>
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
                {console.log('pageOptions', pageOptions)}
                {pageOptions.map((item, key) => (
                  <React.Fragment key={key}>
                    <li className={pageIndex === item ? "page-item active" : "page-item"}>
                      <Link to="#" className="page-link" onClick={() =>{ gotoPage(item);
                          sessionStorage.setItem("currentPageIndex", item);
                          
                       }}>{item + 1}</Link>
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

