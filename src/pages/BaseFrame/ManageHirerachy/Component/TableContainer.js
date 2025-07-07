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
import { Table, Row, Col, Button, UncontrolledTooltip } from "reactstrap"
import JobListGlobalFilter from "./GlobalSearchFilter"
import { Link } from "react-router-dom"
import { usePermissions } from 'hooks/usePermisson';
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
            <Col xxl={3} lg={6} >
                <input type="search" style={{ borderRadius: 25 }} className="form-control" id="search-bar-0" value={value || ""} placeholder={`Search Hierarchy`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
            </Col>
            {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}
        </React.Fragment>
    )
}

const RoleTableContainer = ({
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
    dynamicBtn,
    btnName,
    btnClick
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
                // sortBy: [
                //     {
                //         desc: true,
                //     },
                // ],
            },
        },
        useGlobalFilter,
        // useFilters,
        useSortBy,
        useExpanded,
        usePagination
    )

    const { canView, canEdit } = usePermissions("hirchy");
    // const canEdit = false;


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
                {isAddUserList && (
                    <Col sm="7" xxl="8">
                        <div className="text-sm-end">
                            <Button
                                type="button"
                                color="primary"
                                className="btn mb-2 me-2"
                                onClick={handleUserClick}
                            >
                                <i className="mdi mdi-plus-circle-outline me-1" />
                                Create New User
                            </Button>
                        </div>
                    </Col>
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
                {dynamicBtn && canEdit && (

                    <Col className="d-flex align-items-center justify-content-end">
                        <div className="d-flex justify-content-end">
                            <Button id={`Hierarchy`} onClick={btnClick} className="btn btn-sm " color="buttonPrimaryE" type="button">
                                {btnName}
                            </Button>
                        </div>
                    </Col>
                )}
            </Row>

            {
                data.length > 0 && page.length > 0 ?
                    <div className="table-responsive">
                        <Table {...getTableProps()} className={tableClass}>
                            <thead className={theadClass}>
                                {headerGroups.map(headerGroup => (
                                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column, index) => (
                                            <th key={column.id} className={column.isSort ? "sorting bg-light" : 'bg-light '}
                                                style={{
                                                    width: column.width,
                                                    padding: "0.55rem",
                                                    borderBottomWidth: 0,
                                                    borderTopLeftRadius: index === 0 ? 25 : 0,
                                                    borderBottomLeftRadius: index === 0 ? 25 : 0,
                                                    borderTopRightRadius: index === headerGroup.headers.length - 1 ? 25 : 0,
                                                    borderBottomRightRadius: index === headerGroup.headers.length - 1 ? 25 : 0,
                                                    paddingLeft: "20px",
                                                }}
                                            >
                                                <div className="m-0" {...column.getSortByToggleProps()}>
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
                                                        <td key={cell.id} {...cell.getCellProps()} style={{ paddingLeft: 20 }}>
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
                        <img src={noDataFound} style={{ width: "20%" }} />
                        <label className='font-size-16'>No data found</label>
                    </div>

            }


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

RoleTableContainer.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
}

export default RoleTableContainer
