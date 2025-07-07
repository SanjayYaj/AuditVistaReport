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
import JobListGlobalFilter from "./GlobalSearchFilter"
import { Link } from "react-router-dom"
import noDataFound from "../../../../assets/auditvista/no_data_found.jpg"



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
                    <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`${count} records...`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
                </div>
            </Col>
            {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}
        </React.Fragment>
    )
}

const TemplateTableContainer = ({
    columns,
    data,
    customPageSize,
    isPagination,
    isShowingPageLength,
    paginationDiv,
    pagination,
    tableClass,
    theadClass,
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
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: {
                pageIndex: 0,
                pageSize: customPageSize,
                sortBy: [
                    {
                        id: 'created_on',
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


    return (
        <Fragment>
            {
                data.length > 0 ?
                    <div className="table-responsive mt-2">
                        <Table {...getTableProps()} className={tableClass}>
                            <thead className={theadClass}>
                                {headerGroups.map(headerGroup => {
                                    return (
                                        <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} >
                                            {headerGroup.headers.map(column => (
                                                <th key={column.id} className={column.isSort ? "sorting" : ''} width={column.width}>
                                                    {
                                                        column.isSort ?
                                                            <div className="m-0" {...column.getSortByToggleProps()}>
                                                                {column.render("Header")}
                                                            </div> :
                                                            <div className="m-0" >
                                                                {column.render("Header")}
                                                            </div>
                                                    }
                                                </th>
                                            ))}
                                        </tr>
                                    )
                                })}
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
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <img src={noDataFound} style={{width:"20%"}} />
                    <label className='font-size-16'>No data found</label>
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
                        <div className={paginationDiv} style={{ width: '100%', textAlign: 'right', paddingRight: '0px' }} >
                            <ul className={pagination} style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, justifyContent: 'flex-start', alignItems: 'center' }}>
                                {/* Left arrow */}
                                <li className={`page-item ${!canPreviousPage ? 'disabled' : ''}`}>
                                    <Link to="#" className="page-link" onClick={previousPage}>
                                        <i className="mdi mdi-chevron-left"></i>
                                    </Link>
                                </li>

                                {/* Scrollable container for page numbers */}
                                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '500px', padding: '10px' }}>
                                    {pageOptions.map((item, key) => (
                                        <React.Fragment key={key}>
                                            <li className={pageIndex === item ? 'page-item active' : 'page-item'} style={{ flexShrink: 0 }}>
                                                <Link to="#" className="page-link" onClick={() => gotoPage(item)}>
                                                    {item + 1}
                                                </Link>
                                            </li>
                                        </React.Fragment>
                                    ))}
                                </div>

                                {/* Right arrow */}
                                <li className={`page-item ${!canNextPage ? 'disabled' : ''}`}>
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

TemplateTableContainer.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
}

export default TemplateTableContainer
