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
import {
    Table, Row, Col, Button,
   
} from "reactstrap"
import JobListGlobalFilter from "./GlobalSearchFilter"
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
            <Col lg={4} md={4} >
                <div className="col-12">
                    <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`Search...`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
                </div>
            </Col>
            {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}
        </React.Fragment>
    )
}

const mapUserTableContainer = ({
    columns,
    data,
    isGlobalFilter,
    isJobListGlobalFilter,
    isAddOptions,
    isAddUserList,
    handleOrderClicks,
    handleUserClick,
    handleCustomerClick,
    isAddCustList,
    customPageSize,
    customPageSizeOptions,
    iscustomPageSizeOptions,
    isPagination,
    isShowingPageLength,
    paginationDiv,
    pagination,
    tableClass,
    theadClass,

    labelData,
    labelSelected,
    newCategory,
    filteredDatalength,
    history,
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
            // defaultColumn: { Filter: DefaultColumnFilter },
            initialState: {
                pageIndex: 0,
                pageSize: customPageSize,
                sortBy: [
                    {
                        desc: true,
                    },
                ],
            },
        },
        useGlobalFilter,
        // useFilters,
        useSortBy,
        useExpanded,
        usePagination
    )

    const [folder_Menu, setFolderMenu] = React.useState(false)

    const generateSortingIndicator = column => {
        return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
    }

    const onChangeInSelect = event => {
        setPageSize(Number(event.target.value))
    }

    const toggleFolder = () => {
        setFolderMenu(!folder_Menu)
    }

    return (
        <Fragment>
            <Row className=" align-items-center pb-3">

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

                <Col>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap:2 }}>
                        <div>
                            <select className="form-select form-control"
                                onChange={(e) => labelSelected(e)}
                            >
                                <option value="" disabled={true}>Select User Group</option>
                                <option value="all">All</option>
                                {
                                    labelData?.map((data, idx) => {
                                        return (
                                            <option value={idx} key={"lbl" + idx}>{data.label_name}</option>
                                        )
                                    })
                                }

                            </select>
                        </div>

                           

                            <button color='secondary' className="btn btn-sm btn-outline-secondary" >
                                Total &nbsp;&nbsp;{filteredDatalength}
                            </button>


                            <Button onClick={() => { history("/add-new-user");sessionStorage.setItem("map_location_page",true) }} className="btn-sm d-flex align-items-center" color="primary" type="button">
                                <i className="bx bx-list-plus me-1" style={{ fontSize: '20px' }} /> Add New User
                            </Button>
                        {/* </div> */}


                    </div>
                </Col>

                

            </Row>

         

           
            <div className="table-responsive">
                {
                    data.length === 0 && page.length ===0 ? (
                        <div className="text-center p-3">
                            <h5>No Record Found</h5>
                        </div>
                    ) : (
                        <Table {...getTableProps()} className={tableClass}>
                            <thead className={theadClass}>
                                {headerGroups.map(headerGroup => (
                                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th key={column.id} className={column.isSort ? "sorting" : ''} width={column.width}>
                                                {
                                                    column.isSort ?
                                                        <div className="m-0" >
                                                            {column.render("Header")}
                                                        </div> :
                                                        <div className="m-0" >
                                                            {column.render("Header")}
                                                        </div>
                                                }

                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            <tbody {...getTableBodyProps()}>
                                {page.map(row => {
                                    prepareRow(row)
                                    // const userIdx = addedUsers.some(user => user._id === row.original._id);
                                    const userIdx = addedUsers?.some(user => user._id === row.original._id);
                                    return (
                                        <Fragment key={row.getRowProps().key}>
                                            <tr>
                                                {row.cells.map(cell => {
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
                    )}
            </div>


            {
                isPagination && (
                    <Row className="justify-content-end align-items-center mt-2">
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
        </Fragment>
    )
}

mapUserTableContainer.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
}

export default mapUserTableContainer
