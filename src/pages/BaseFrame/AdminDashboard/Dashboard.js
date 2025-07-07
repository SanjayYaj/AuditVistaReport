import React from "react"
import { Container, Row, Col,Spinner } from "reactstrap"
import { useEffect, useState } from "react"
import urlSocket from "../../../helpers/urlSocket"
import CardUser from "./CardUser"
import _ from 'lodash'
import { getFCMToken, listenForNotifications } from "../../../helpers/generateNotifyToken"
import NewDashboard from "./NewDashboard"

const DashboardSaas = props => {

  const [userInfo,setuserInfo] = useState()
  const [clientInfo,setClientInfo] = useState({})
  const [facility,setFacility] = useState({})
  const [dataLoaded,setdataLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
    var userInfo = JSON.parse(sessionStorage.getItem('authUser'))
    var client_info = userInfo.client_info[0]
    setClientInfo(client_info)
    getFCMToken()
    listenForNotifications()
    var user_facility = await get_user_facilities(userInfo.user_data,userInfo.db_info)
    setFacility(user_facility)
    var user_data = userInfo.user_data
    var db_info = userInfo.db_info
    setuserInfo(user_data)
    db_info["user_id"]=user_data._id
    try {
      await retriveAnalyticsInfo(userInfo)
      setdataLoaded(true)
    } catch (error) {

    }
  }
  fetchData()

  }, [])


const  get_user_facilities = async (user_data, db_info) => {
  
    try {
      const response = await urlSocket.post('cog/get-role-facilities', {
        encrypted_db_url: db_info.encrypted_db_url,
        user_data: user_data,
      });
       return response.data.data[0].facilities
    }
    catch(error){

    }
  }


  const retriveAnalyticsInfo=async(authUser)=>{

    try {
       const responseData = await urlSocket.post("cog/dashboard-details",{
          encrypted_db_url :authUser.db_info.encrypted_db_url,
          user_id :authUser.user_data.encrypted_db_url,
        })


    } catch (error) {
      
    }

  }


  document.title = "Dashboard | AuditVista"
if(dataLoaded){
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {
            userInfo && <CardUser user_data={userInfo} clientInfo={clientInfo} />
          }
          <NewDashboard/>
        </Container>
      </div>
    </React.Fragment>
  )
}
else{
  return(
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div>Loading...</div>
   <Spinner color="primary" />         
 </div>
  )
}
}

export default DashboardSaas


