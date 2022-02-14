import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button, Table } from "react-bootstrap";
import { Modal, message } from 'antd';

import { url, header } from '../../Constant/Constant'
import Maps from "../../views/Maps";
import routes from "../../routes";
import Chat from "../../views/Chat"
import '../../Style/NotificationM.css'
import '../../Style/Profile.css'

function Header() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal2Visible, setIsModal2Visible] = useState(false);
  const [NotificationData, setNotificationData] = useState('')
  const [OrderData, setOrderData] = useState('')
  const history = useNavigate()
  const location = useLocation();
  const [Password, setPassword] = useState('')
  const [NewPassword, setNewPassword] = useState('')
  const [ConfirmPassword, setConfirmPassword] = useState('')
  const Email = localStorage.getItem('PS-email')

  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };


  // Get Brand Data
  useEffect(() => {
    fetch(`${url}/api/latestNotifications`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setNotificationData(data.doc.slice(0, 7))
      })
  }, [])

  const showItemModal = (data) => {
    setIsModalVisible(true);
    fetch(`${url}/api/searchOrderByID`, {
      method: 'POST',
      body: JSON.stringify({
        orderId: data,
      }),
      headers: header
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.doc)
        setOrderData(data.doc)
      })
  };

  const OnPassChange = () => {
    if (NewPassword === ConfirmPassword) {
      fetch(`${url}/api/updateAdminPassword`, {
        method: 'POST',
        body: JSON.stringify({
          email: Email,
          password: Password,
          newPass: NewPassword
        }),
        headers: header
      })
        .then(res => res.json())
        .then(data => {
          console.log(data.doc)
          if (data.message === 'Success') {
            setPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setIsModal2Visible(false);
          }
        })
    } else {
      message.error("Password didn't Match")
    }

  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsModal2Visible(false);
  };


  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
            <Button
              variant="dark"
              className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
              onClick={mobileSidebarToggle}
            >
          <i class="fa-solid fa-align-justify"></i>            
          </Button>
            
          </div>
          <div>
          <Navbar.Brand
              href="#home"
              onClick={(e) => e.preventDefault()}
              className="mr-2"
            >
              {getBrandText()}
            </Navbar.Brand>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
            <span className="navbar-toggler-bar burger-lines"></span>
            <span className="navbar-toggler-bar burger-lines"></span>
            <span className="navbar-toggler-bar burger-lines"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav" style={{"flex-grow": 0}}>
            <Nav className="ml-auto" navbar>
              <i onClick={() => setIsModal2Visible(true)} class="fas fa-user-cog Setting-icon"></i>
              <i class="far fa-bell N-icon">
                <div className='AN-list'>
                  {
                    NotificationData && NotificationData.map(data => (
                      data.notificationType === 0 ? (
                        <div onClick={() => showItemModal(data.order.orderId)} className='Card'>
                          <h2><i class="fas fa-bell"></i>{`New Order by ${data.user.fName} with OrderID ${data.order.orderId}`}</h2>
                        </div>
                      ) : (
                          <div onClick={() => history('/admin/OrderRequest')} className='Card'>
                            <h2><i class="fas fa-bell"></i>{`New Order Request by ${data.user.fName} with OrderID ${data.orderRequest.orderId}`}</h2>
                          </div>
                        )
                    ))
                  }
                  <h3 onClick={() => history('/admin/NotificationManagement')}>See All</h3>
                </div>
              </i>
              <Chat />
              <Nav.Item>
                <Nav.Link
                  className="m-0"
                  href="/login"
                  onClick={() => {
                    sessionStorage.setItem('PS-isLogedIn', '')
                    localStorage.setItem('PS-email', '')
                    history('/')
                  }}
                >
                  <span className="no-icon">Log out</span>
                </Nav.Link>
              </Nav.Item>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Modal width="800px" style={{ top: 20 }} title="Order Details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {OrderData &&
          <>
            <h3 className='O-item h4-heading'>User info</h3>
            <div className="OM-modal">
              <div>
                <h4 className='O-item O-zoneAddress'>Name</h4>
                <p>  {OrderData.user.fName && OrderData.user.fName}  </p>
              </div>
              <div>
                <h4 className='O-item O-zoneAddress'>OrderId</h4>
                <p>  {OrderData.orderId && OrderData.orderId}  </p>
              </div>
              <div>
                <h4 className='O-item O-zoneAddress'>Phone</h4>
                <p>{OrderData.user.phone && OrderData.user.phone}</p>
              </div>
            </div>
            <h3 className='O-item h4-heading'>Delivery Info</h3>
            <div className="OM-modal2">
              <div>
                <h4 className='O-item O-zoneAddress'>Zone Address</h4>
                <p>{OrderData.addressDetails.zone !== null && OrderData.addressDetails.zone.name}</p>
              </div>
              <div>
                <h4 className='O-item O-zoneAddress'>Zone Charges</h4>
                <p>{OrderData.zoneCharges && OrderData.zoneCharges} DZD</p>
              </div>
            </div>
            <h4 className='O-item'>Delivery Address</h4>
            <p>{OrderData.addressDetails.address && OrderData.addressDetails.address}</p>
            <Maps CoOrdinates={OrderData.addressDetails.location && OrderData.addressDetails.location} />
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
                  OrderData.items && OrderData.items.map(itemData => (
                    <tr>
                      <td> {itemData.item.title} </td>
                      <td> {itemData.unitPrice}</td>
                      <td> {itemData.quantity} </td>
                      <td> {itemData.item.actualCost * itemData.quantity} </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
            <div className="OM-GT">
              <div>
                <h3 className='O-item O-zoneAddress'>Gross Total = <span className='OM-color'> {OrderData.total && OrderData.total} DZD </span> </h3>
              </div>
            </div>
          </>
        }
      </Modal>


      <Modal width="500px" style={{ top: 20 }} title="Password Change" visible={isModal2Visible} okText='Save Change' onOk={OnPassChange} onCancel={handleCancel}>
        <div className='password-div'>
          <input value={Password} onChange={e => setPassword(e.target.value)} placeholder='Current Password' />
          <input value={NewPassword} onChange={e => setNewPassword(e.target.value)} placeholder='New Password' />
          <input value={ConfirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder='Confirm Password' />
        </div>
      </Modal>

    </>
  );
}

export default Header;
