import React from 'react';
import { useState } from 'react';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { useDispatch } from "react-redux";
import { setReportTreeNodeInfo, retrivePageLayout } from '../../../Slice/reportd3/reportslice';
import {Spinner,Card,Col,CardBody} from 'reactstrap'

const propTypes = {};

const defaultProps = {};

/**
 * 
 */
const ReportUserTree = (props) => {
    const dispatch = useDispatch()
    const [dataLoaded,setDataLoaded] = useState(true)

    const buildTreeNodes=(nodes)=>{
        return nodes.map((node) => {
            const { title, children, id,  parent, type} = node;
            const hasChildren =  (children && children.length > 0) ;
            return {
              label: title,
              id,
              parent,
              children: hasChildren ? buildTreeNodes(children) : [],
              expanded : true,
      
              title: (
                <div 
                onClick={()=>{dispatch(setReportTreeNodeInfo(node));sessionStorage.setItem("pageNodeInfo", JSON.stringify(node));props.enablePreview();sessionStorage.setItem('layout_preview', true);dispatch(retrivePageLayout())}}
                  style={{
                    position: 'relative',
                    zIndex: 'auto',
                    minHeight: '24px',
                    margin: '0',
                    padding: '0 4px',
                    color: 'inherit',
                    lineHeight: '24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s, border 0s, line - height 0s, box - shadow 0s'
                  }}
                >
                  {
                   type == 0
                   ? (
                    <FolderOutlined style={{ cursor: 'unset', opacity: 0.5 }} />
                  ) : (
                    <FileOutlined
                      style={{
                        cursor: 'pointer',
                        color: '#556EE6',
                        opacity: 1,
                      }}
                    />
                  )}
                   <span 
                   style={{ marginLeft: '4px', opacity: type ===0  ?  1 :0.5, fontWeight: type ===0 ? 600 :'' }}
                   >
                    {title}
                  </span>
                </div>
              ),
      
            };
          });
    }
    if(dataLoaded){
    var treeNode = buildTreeNodes(props.reportTemplateTree)
    return (
    <div>
        <Tree
        style={{ borderColor: '#150101' }}
        defaultExpandAll={true}
        treeData={treeNode}
        showLine={true}
        showIcon={true}
        />

    </div>)
    }
    else{
        return ( <Col lg="12">
        <Card>
            <CardBody style={{ height: "100vh" }}>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div>Loading...</div>
                    <Spinner className="ms-2" color="primary" />
                </div>
            </CardBody>
        </Card>
    </Col>)
    }
    ;
}

ReportUserTree.propTypes = propTypes;
ReportUserTree.defaultProps = defaultProps;

export default ReportUserTree;