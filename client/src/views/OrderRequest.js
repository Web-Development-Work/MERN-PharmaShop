import React, { useState, useEffect } from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Pagination, Spin } from 'antd';
import { useDispatch } from "react-redux";
import { LoadingOutlined } from '@ant-design/icons';

import { OrderRequestAction } from "../Redux/Actions/OrderRequest";
import { url, header } from '../Constant/Constant'
import '../Style/OrderRequest.css'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


function OrderRequest() {

  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);

  const [CurrentPage, setCurrentPage] = useState(1)
  const [GetTotalPages, setGetTotalPages] = useState('')
  const [GetOrderRequest, setGetOrderRequest] = useState('')
  const history = useNavigate()
  const dispatch = useDispatch()

  if (sessionStorage.getItem('PS-isLogedIn') === 'false') {
    history('/')
  }

  const OnPaginationchange = (current) => {
    setCurrentPage(current)
  }

  // Get Products API
  useEffect(() => {
    fetch(`${url}/api/orderRequests${CurrentPage}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setGetTotalPages(data.doc.pages)
        setGetOrderRequest(data.doc.data)
      })

  }, [CurrentPage])


  // On Reject Button click
  const OnReject = (id) => {
    fetch(`${url}/api/rejectOrderRequest`, {
      method: 'PUT',
      body: JSON.stringify({
        id: id
      }),
      headers: header
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setGetOrderRequest([...GetOrderRequest])
      }
      )
  }

  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#58D68D' }} spin />


  return (
    <>
      <div className="wrapper">
      <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
      <div className="main-panel">
      <AdminNavbar />
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Order Request</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Date</th>
                      <th className="border-0">User</th>
                      <th className="border-0">Address</th>
                      <th className="border-0">Note</th>
                      <th className="border-0"></th>
                      <th className="border-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      GetOrderRequest ? GetOrderRequest && GetOrderRequest.map(data => (
                        <tr key={data._id}>
                          <td> {data.createdDate} </td>
                          <td> {data.user.fName} </td>
                          <td> {data.deliveryAddress.address} </td>
                          <td> {data.notes} </td>
                          <td>
                            <Button onClick={() => dispatch(OrderRequestAction(data, history))} className='btn-fill pull-right O-view-btn O-btn' >Create</Button>
                          </td>
                          <td>
                            <Button className='btn-fill pull-right O-delete-btn O-btn' onClick={() => OnReject(data._id)} >Reject</Button>
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
      </Container>
      </div>
      </div>
    </>
  );
}

export default OrderRequest;
