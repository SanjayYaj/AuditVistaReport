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
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap"
import JobListGlobalFilter from "./GlobalSearchFilter"
import { Link } from "react-router-dom"
import FuzzySearch from '../../../../common/FuzzySearch';
import { usePermissions } from 'hooks/usePermisson';



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
                    <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`Search Location...`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
                </div>
            </Col>
            {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}
        </React.Fragment>
    )
}

const RoleTableContainer = ({
    selectedEOPT,
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
    btnClick,
    search_group_name,
    getFuzzySearch,
    dup_search_group_name,
    dup_temp_search_group,
    dup_labelData,
    moveToLabel,
    toggle2,
    labelDefault,
    removeFromLabel,
    confirmDelete,
    resultData,
    filterStatus,
    show_selected,
    totalEntities,
    isAllSelected
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
    const { canView, canEdit } = usePermissions("mels");
    // const canEdit = false
    

    const generateSortingIndicator = column => {
        return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
    }

    const onChangeInSelect = event => {
        setPageSize(Number(event.target.value))
    }

    const toggleFolder = () => {
        // page.forEach((row) => {
        //     row.original.selected =false;
        //   }); 
        setFolderMenu(!folder_Menu)
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

                {dynamicBtn && canEdit && (
                    <Col lg={8} md={8} >

                        <div className="d-flex justify-content-end">
                            <Button onClick={() => { btnClick() }} className="btn-sm d-flex align-items-center" color="primary" type="button">
                                <i className="bx bx-list-plus me-1" style={{ fontSize: '20px' }} /> {btnName}
                            </Button>
                        </div>                     
                    </Col>
                )}
            </Row>

            {

                <Row className="mb-1">
                    <div className="d-flex" >

                        {
                             isAllSelected && selectedEOPT.length > 0 && (
                                <div>
                                    <Dropdown isOpen={folder_Menu} toggle={() => toggleFolder()} className="">
                                        <DropdownToggle className="btn btn-sm btn-primary" tag="i">
                                            <i className="fa fa-folder ms-2" />
                                            <i className="mdi mdi-arrow-right ms-1" />
                                        </DropdownToggle>

                                        <DropdownMenu className="p-4" style={{ minWidth: "300px", zIndex: 2 }}>
                                            <div className="pb-3">
                                                <FuzzySearch
                                                    search_files={search_group_name}
                                                    getFuzzySearch={getFuzzySearch}
                                                    dup_search_files={dup_search_group_name}
                                                    temp_search_files={dup_temp_search_group}
                                                    keyword={['label_name']}
                                                    className="form-control"
                                                />
                                            </div>

                                            <div className="row">
                                                {dup_labelData?.map((item, idx) => (
                                                    <div className="col-12 py-1" key={'lbl' + idx}>
                                                        <div
                                                            style={{ textAlign: 'left', borderRadius: '0px' }}
                                                            className="btn btn-sm col-12"
                                                            onClick={() => moveToLabel(item)}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = '#556EE6';
                                                                e.target.style.color = '#FFF';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = '';
                                                                e.target.style.color = '';
                                                            }}
                                                        >
                                                            <i style={{ color: item.label_color }} className="mdi mdi-circle font-size-10" />
                                                            &nbsp;&nbsp;{item.label_name}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-2 text-end">
                                            <button onClick={toggle2} className="btn btn-sm btn-outline-primary" >
                                                Create location Group
                                            </button>
                                            </div>
                                        </DropdownMenu>
                                    </Dropdown>


                                   
                                </div>
                            )
                        }








                        <div className="mb-1">
                            {
                                
                                    !labelDefault && isAllSelected && selectedEOPT.length > 0 &&canEdit &&
                   
                                    <button className="btn btn-sm btn-outline-danger mx-2" onClick={() => { removeFromLabel(); }} >
                                        <i className="mdi mdi-domain font-size-12 me-2" />
                                        Ungroup selected
                                    </button>
                                    
                                    // )
                            }
                            {
                                !labelDefault  && canEdit &&
                              
                                <button className="btn btn-sm btn-outline-danger" onClick={() => { confirmDelete() }} >
                                    <i className="mdi mdi-domain font-size-12 me-2" />Delete this group
                                </button>
                            }

                        </div>
                    </div>
                </Row>
            }


            {
                data.length > 0 && page.length >0 ?
                    <div className="table-responsive">
                        <Table {...getTableProps()} className={tableClass}>
                            <thead className={theadClass}>
                                {headerGroups.map(headerGroup => (
                                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
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
