import React, { useState, useEffect } from "react";
import ChartistGraph from "react-chartist";
import { useNavigate } from 'react-router-dom'
import { Card, Container, Row, Col } from "react-bootstrap";
import { useLocation, Route, Routes, Link } from "react-router-dom";
import { url, header } from '../Constant/Constant'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


function Dashboard() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const [GetAdminAnalytics, setGetAdminAnalytics] = useState('')
  const [GetOrdersDate, setGetOrdersDate] = useState('')
  const [GetOrdersValue, setGetOrdersValue] = useState('')
  const [GetEarningDate, setGetEarningDate] = useState('')
  const [GetEarningValue, setGetEarningValue] = useState('')
  const [GetUsersDate, setGetUsersDate] = useState('')
  const [GetUsersValue, setGetUsersValue] = useState('')
  const [GetBestproduct, setGetBestproduct] = useState('')
  const history = useNavigate()
  const mainPanel = React.useRef(null);
  const location = useLocation();



  if (sessionStorage.getItem('PS-isLogedIn') === 'false') {
    history('/')
  }

  useEffect(() => {
    fetch(`${url}/api/adminanalytics`)
      .then(res => res.json())
      .then(data => {
        console.log('data----->',data)
        setGetAdminAnalytics(data)
      })

    fetch(`${url}/api/getlast30daysorderscountperday`)
      .then(res => res.json())
      .then(data => {
        setGetOrdersDate(data.datee.reverse())
        setGetOrdersValue(data.values.reverse())
      })

    fetch(`${url}/api/getlast30daysearningcountperday`)
      .then(res => res.json())
      .then(data => {
        setGetEarningDate(data.datee.reverse())
        setGetEarningValue(data.values.reverse())
      })

    fetch(`${url}/api/getlast30daysusersregistercountperday`)
      .then(res => res.json())
      .then(data => {
        setGetUsersDate(data.datee.reverse().slice(1))
        setGetUsersValue(data.values.reverse().slice(1))
      })

    fetch(`${url}/api/bestSellingProducts`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        setGetBestproduct(data.doc.splice(0,5))
      })
  }, [])


  // useEffect(() => {
  //   document.documentElement.scrollTop = 0;
  //   document.scrollingElement.scrollTop = 0;
  //   mainPanel.current.scrollTop = 0;
  //   if (
  //     window.innerWidth < 993 &&
  //     document.documentElement.className.indexOf("nav-open") !== -1
  //   ) {
  //     document.documentElement.classList.toggle("nav-open");
  //     var element = document.getElementById("bodyClick");
  //     element.parentNode.removeChild(element);
  //   }
  // }, [location]);

  return (
    <>
      <div className="wrapper">
      <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
      <div className="main-panel">
      <AdminNavbar />
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row style={{ padding: '15px 0' }}>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i class="fas fa-users  text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Users</p>
                      <Card.Title as="h4"> {GetAdminAnalytics ? GetAdminAnalytics.totalusers : 'Empty'} </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row style={{ padding: '15px 0' }}>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i class="fa fa-newspaper text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Orders</p>
                      <Card.Title as="h4"> {GetAdminAnalytics ? GetAdminAnalytics.totalorders : 'Empty'} </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row style={{ padding: '15px 0' }}>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i class="fa fa-layer-group text-warning"></i>

                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category"> Total Products </p>
                      <Card.Title as="h4"> {GetAdminAnalytics ? GetAdminAnalytics.totalproducts : 'Empty'} </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row style={{ padding: '15px 0' }}>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i class="fa fa-coins text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category"> Total Earning </p>
                      <Card.Title as="h4"> {GetAdminAnalytics ? GetAdminAnalytics.earning : 'Empty'} </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Last 15 Days Order</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartActivity">
                  <ChartistGraph
                    data={{
                      labels: GetOrdersDate ? GetOrdersDate : [''],
                      series: [GetOrdersValue ? GetOrdersValue : ['']],
                    }}
                    type="Bar" options={{
                      seriesBarDistance: 10,
                      axisX: { showGrid: false, }, height: "245px",
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          seriesBarDistance: 5,
                          // axisX: {
                          //   labelInterpolationFnc: function (value) {
                          //     return value[0];
                          //   },
                          // },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Last 15 Days Earning</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartActivity">
                  <ChartistGraph
                    data={{
                      labels: GetEarningDate ? GetEarningDate : [''],
                      series: [GetEarningValue ? GetEarningValue : ['']],
                    }}
                    type="Bar" options={{
                      seriesBarDistance: 10,
                      axisX: { showGrid: false, }, height: "245px",
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          seriesBarDistance: 5,
                          // axisX: {
                          //   labelInterpolationFnc: function (value) {
                          //     return value[0];
                          //   },
                          // },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md='4'>
            <Card>
              <Card.Header>
                <Card.Title as="h4">Best Selling Products</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className='D-sold-div'>
                <div className='D-sold'></div>
                <p >Sold</p>
                </div>
                {
                  GetBestproduct ? GetBestproduct && GetBestproduct.map((data,index) => (
                    <li className='D-li' key={index}>
                         {data.title} (<span className='D-s'>{data.sold}</span>) 
                    </li>
                  )) : <></>
                }
              </Card.Body>
            </Card>
          </Col>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Last 10 Days User's Registered</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartActivity">
                  <ChartistGraph
                    data={{
                      labels: GetUsersDate ? GetUsersDate : [''],
                      series: [GetUsersValue ? GetUsersValue : ['']],
                    }}
                    type="Bar" options={{
                      seriesBarDistance: 10,
                      axisX: { showGrid: false, }, height: "245px",
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          seriesBarDistance: 5,
                          // axisX: {
                          //   labelInterpolationFnc: function (value) {
                          //     return value[0];
                          //   },
                          // },
                        },
                      ],
                    ]}
                  />
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

export default Dashboard;
