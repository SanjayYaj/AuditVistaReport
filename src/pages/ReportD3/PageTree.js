import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TreeStructure from './Components/SortableTree/TreeStructure';
import { Container,Row,Col } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';

import { retrivePageTree } from '../../Slice/reportd3/treedataSlice';
import { usePermissions } from 'hooks/usePermisson';

    const {canEdit,canView} = usePermissions("user_report")

const propTypes = {};

const defaultProps = {};

/**
 * 
 */
const PageTree = () => {

    console.log('canEdit :>> ', canEdit);
    const [pageInfo, setpageInfo] = useState(JSON.parse(sessionStorage.getItem("page_data")))
    const dispatch = useDispatch()
    const history = useNavigate()
    const reportSlice = useSelector(state => state.reportSliceReducer)

    const authInfo = useSelector((state) => state.auth);
    const authUser = authInfo.userInfo



    useEffect(() => {
        console.log('authInfo PageTree :>> ', authInfo);
        dispatch(retrivePageTree(authInfo , canEdit))
    }, [])

    const gotoBack=()=>{
        canEdit? history("/report") :
        history("/user_report")
    }




    return (<React.Fragment>
        <div className="page-content" >
            <Container fluid>
                <Breadcrumbs
                    title={pageInfo.name}
                    link={"Layout / "}
                    description={pageInfo.description}
                    breadcrumbItem="Page Layout"
                    isBackButtonEnable={true}
                    gotoBack={() => gotoBack()}
                    labelName={'Back'}
                />


                <Row>
                    <Col md={12}>
                        <TreeStructure />
                    </Col>
                </Row>

            </Container>

        </div>


    </React.Fragment>);
}

PageTree.propTypes = propTypes;
PageTree.defaultProps = defaultProps;
// #endregion

export default PageTree;