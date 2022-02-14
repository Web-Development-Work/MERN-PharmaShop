import React, { useState, useEffect } from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { Modal, Select, Pagination, Spin } from 'antd';
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from '@ant-design/icons';

import { url, header } from '../Constant/Constant'
import '../Style/OrderM.css'
import Maps from "./Maps";
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";

const { Option } = Select;

function OrderM() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [CurrentPage, setCurrentPage] = useState(1)
  const [GetTotalPages, setGetTotalPages] = useState('')
  const [ItemDetails, setItemDetails] = useState('')
  const [MapsDetail, setMapsDetail] = useState('')
  const [ZoneCharges, setZoneCharges] = useState('')
  const [SearchName, setSearchName] = useState('')
  const [GetOrders, setGetOrders] = useState('')
  const [phone, setphone] = useState('')
  const [UserName, setUserName] = useState('')
  const [OrderId, setOrderId] = useState('')
  const [GrossTotal, setGrossTotal] = useState('')
  const history = useNavigate()

  if (sessionStorage.getItem('PS-isLogedIn') === 'false') {
    history('/')
  }

  // Get Orders API
  useEffect(() => {
    fetch(`${url}/api/allPendingOrders${CurrentPage}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.doc)
        setGetOrders(data.doc.data)
        setGetTotalPages(data.doc.pages)
      })
  }, [])

  const OnPaginationchange = (current) => {
    setCurrentPage(current)
  }

  const StatushandleChange = (id, value,index) => {
    fetch(`${url}/api/updateOrderStatus`, {
      method: 'POST',
      body: JSON.stringify({
        id: id,
        status: value
      }),
      headers: header
    })
      .then(res => res.json())
      .then(data => {
        if(id === data.doc._id){
          GetOrders[index] = data.doc
          setGetOrders([...GetOrders])
        }
      })

  }

  const showItemModal = (data, details, zoneCharges, phone, name, orderId, total) => {
    setIsModalVisible(true);
    setItemDetails(data)
    setMapsDetail(details)
    setZoneCharges(zoneCharges)
    setphone(phone)
    setUserName(name)
    setOrderId(orderId)
    setGrossTotal(total)
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const OnSearch = () => {
    fetch(`${url}/api/searchOrderByID`, {
      method: 'POST',
      body: JSON.stringify({
        orderId: parseInt(SearchName)
      }),
      headers: header
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.message === 'Success') {
          setGetOrders([data.doc])
        }
      })
  }

  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#58D68D' }} spin />

  return (
    <>
      <div className="wrapper">
      <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
      <div className="main-panel">
      <AdminNavbar />
      <Container fluid>
        <div className='U-search'>
          <input value={SearchName} onChange={e => setSearchName(e.target.value)} placeholder='Search by Order Id...' className='U-input' />
          <i onClick={OnSearch} className="nc-icon nc-zoom-split search-icon"></i>
        </div>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Order Management</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Id</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Total</th>
                      <th className="border-0">Phone</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Change Status</th>
                      <th className="border-0"></th>
                      <th className="border-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      GetOrders ? GetOrders && GetOrders.map((data,index) => (
                        <tr key={data._id}>
                          <td>{data.orderId}</td>
                          <td> {data.user.fName} </td>
                          <td> {data.total} DZD</td>
                          <td> {data.user.phone} </td>
                          <td> {data.status == 0 ? 'Pending' : data.status === 1 ? 'Preparing' : data.status === 2 ? 'Partial' : data.status === 3 ? 'Completed' : data.status === 4 ? 'Rejected' : 'No Respnse'} </td>
                          <td>
                            <Select defaultValue={data.status == 0 ? 'Pending' : data.status === 1 ? 'Preparing' : data.status === 2 ? 'Partial' : data.status === 3 ? 'Completed' : data.status === 4 ? 'Rejected' : 'No Respnse'} style={{ width: 120 }} onChange={(value) => StatushandleChange(data._id, value,index)}>
                              <Option disabled value={0}>Pending</Option>
                              <Option value={1}>Preparing</Option>
                              <Option value={2}>Partial</Option>
                              <Option value={3}>Completed</Option>
                              <Option value={4}>Cancelled</Option>
                            </Select>
                          </td>
                          <td>
                            <Button className="btn-fill pull-right O-view-btn O-btn O-update" onClick={() => window.open(`https://maps.google.com/?q=${data.addressDetails.location[1]},${data.addressDetails.location[0]}`) }  type="submit" variant="info" > Share Location </Button>
                          </td>
                          <td>
                            <Button className="btn-fill pull-right O-view-btn O-btn" onClick={() => showItemModal(data.items, data.addressDetails, data.zoneCharges, data.user.phone, data.user.fName, data.orderId, data.total)} type="submit" variant="info" > View InVoice </Button>
                          </td>
                        </tr>
                      )) : <tr>
                          <td> <Spin indicator={antIcon} /> </td>
                          <td> <Spin indicator={antIcon} /> </td>
                          <td> <Spin indicator={antIcon} /> </td>
                          <td> <Spin indicator={antIcon} /> </td>
                          <td> <Spin indicator={antIcon} /> </td>
                          <td> <Spin indicator={antIcon} /> </td>
                        </tr>
                    }
                  </tbody>
                </Table>
                <div className='P-pagination'>
                  <Pagination onChange={OnPaginationchange} showSizeChanger defaultCurrent={1} total={GetTotalPages * 10} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal width="800px" style={{ top: 20 }} title="Order Details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>

          <h3 className='O-item h4-heading'>User info</h3>
          <div className="OM-modal">
            <div>
              <h4 className='O-item O-zoneAddress'>Name</h4>
              <p>  {UserName ? UserName : 'Empty'}  </p>
            </div>
            <div>
              <h4 className='O-item O-zoneAddress'>OrderId</h4>
              <p>  {OrderId ? OrderId : 'Empty'}  </p>
            </div>
            <div>
              <h4 className='O-item O-zoneAddress'>Phone</h4>
              <p>  {phone ? phone : 'Empty'}  </p>
            </div>
          </div>
          <h3 className='O-item h4-heading'>Delivery Info</h3>
          <div className="OM-modal2">
            <div>
              <h4 className='O-item O-zoneAddress'>Zone Address</h4>
              <p> {MapsDetail ? MapsDetail.zone.name : 'Empty'} </p>
            </div>
            <div>
              <h4 className='O-item O-zoneAddress'>Zone Charges</h4>
              <p>  {ZoneCharges ? ZoneCharges : 'Empty'} $ </p>
            </div>
          </div>
          <h4 className='O-item'>Delivery Address</h4>
          <p> {MapsDetail ? MapsDetail.address : 'Empty'} </p>
          <Maps CoOrdinates={MapsDetail ? MapsDetail.location : null} />
          <h3 className='O-item O-item-space'>Items</h3>
          <Table className="table-hover table-striped">
            <thead>
              <tr>
                <th className="border-0">Name</th>
                <th className="border-0">Prize</th>
                <th className="border-0">Quantity</th>
                <th className="border-0">Total</th>
              </tr>
            </thead>
            <tbody>
              {
                ItemDetails ? ItemDetails && ItemDetails.map(data => (
                  <tr>
                    <td> {data.item.title} </td>
                    <td> {`${data.item.actualCost}`} </td>
                    <td> {data.quantity} </td>
                    <td> {data.item.actualCost * data.quantity} </td>
                  </tr>
                )) : <></>
              }
            </tbody>
          </Table>
          <div className="OM-GT">
            <div>
              <h3 className='O-item O-zoneAddress'>Gross Total = <span className='OM-color'> {GrossTotal ? GrossTotal : 'Null'} </span> </h3>
            </div>
          </div>
        </Modal>

      </Container>
      </div>
      </div>
    </>
  );
}

export default OrderM;
