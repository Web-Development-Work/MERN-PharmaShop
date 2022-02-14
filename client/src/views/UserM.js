import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router'
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { Pagination, Spin, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Maps from "./Maps"
import { url, header } from '../Constant/Constant'
import '../Style/UserM.css'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


function UserM() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const [Userdata, setUserdata] = useState('')
  const [MapModalVisible, setMapModalVisible] = useState(false);
  const [Address, setAddress] = useState('')
  const [CurrentPage, setCurrentPage] = useState(1)
  const [GetTotalPages, setGetTotalPages] = useState('')
  const [SearchName, setSearchName] = useState('')
  const history = useNavigate()
  const [PushNotification, setPushNotification] = useState('')

  if (sessionStorage.getItem('PS-isLogedIn') === 'false') {
    history('/')
  }

  useEffect(() => {
    fetch(`${url}/api/users${CurrentPage}`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        setUserdata(data.doc.data)
        console.log(data.doc.data)
        setGetTotalPages(data.doc.pages)
      })
  }, [CurrentPage])

  // On click UnBlock Button this api calls
  const onBlockedBtn = (i) => {
    fetch(`${url}/api/blockUser`, {
      method: 'PUT',
      body: JSON.stringify({
        id: i
      }),
      headers: header
    })
      .then(res => res.json())
      .then(data => {
        const arr = Userdata.map(item => {
          if (item._id === data.doc._id) {
            return data.doc
          }
          else {
            return item
          }
        })
        setUserdata(arr)
      }
      )
  }

  // On click Block Button this api calls
  const onUnBlockedBtn = (i) => {
    fetch(`${url}/api/unblockUser`, {
      method: 'PUT',
      body: JSON.stringify({
        id: i
      }),
      headers: header
    })
      .then(res => res.json())
      .then(data => {
        const arr = Userdata.map(item => {
          if (item._id === data.doc._id) {
            return data.doc
          }
          else {
            return item
          }
        })
        setUserdata(arr)
      }
      )
  }

  const OnSearch = () => {
    fetch(`${url}/api/searchUsers`, {
      method: 'POST',
      body: JSON.stringify({
        name: SearchName
      }),
      headers: header
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        if (data.message === 'Success') {
          setUserdata(data.doc)
        }
      }
      )
  }

  const OnPaginationchange = (current) => {
    setCurrentPage(current)
  }

  // Address Modal
  const showMapModal = (data) => {
    setMapModalVisible(true);
    setAddress(data)
  };

  const PushModalVisible = () => {
    setPushNotification(true);
  
  };

  const handleOk = () => {
    setMapModalVisible(false);
    setPushNotification(false);
  };

  const handleCancel = () => {
    setMapModalVisible(false);
    setPushNotification(false)
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#58D68D' }} spin />


  return (
    <>
      <div className="wrapper">
      <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
      <div className="main-panel">
      <AdminNavbar />
      <Container fluid>
        <div className='U-search'>
          <input value={SearchName} onChange={e => setSearchName(e.target.value)} placeholder='Search...' className='U-input' />
          <i onClick={OnSearch} className="nc-icon nc-zoom-split search-icon"></i>
        </div>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">User Management</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Name</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Phone</th>
                      <th className="border-0">Addresses</th>
                      <th className="border-0">Push Notification</th>
                      <th className="border-0"> Current Status </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      Userdata ? Userdata && Userdata.map(data => (
                        <tr key={data._id}>
                          <td>{data.fName ? data.fName : 'No Name'}</td>
                          <td> {data.email ? data.email : 'No email'} </td>
                          <td> {data.phone ? data.phone : 'No Phone'} </td>
                          <td> <Button onClick={() => showMapModal(data.addresses)} className="btn-fill pull-right U-btn UB-btn" type="submit" variant="info" > Addresses </Button> </td>
                          <td> <Button onClick={() => PushModalVisible()} className="btn-fill pull-right C-update" type="submit" variant="info" > Push Notification </Button> </td>
                          <td>
                            {data.blocked
                              ? (<Button onClick={() => onUnBlockedBtn(data._id)} className="btn-fill pull-right U-btn" type="submit" variant="info" > Blocked </Button>)
                              : (<Button onClick={() => onBlockedBtn(data._id)} className="btn-fill pull-right U-btn UB-btn" type="submit" variant="info" > UnBlocked </Button>)}
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
        <Modal width={700} style={{ top: 20 }} title="Address Details" visible={MapModalVisible} onOk={handleOk} onCancel={handleCancel}>
          {
            Address ? Address && Address.map((data,index) => (
              <div className="modal-div" key={index}>
                <div className="modal-p1">
                  <Card.Title as="h4">{data.name}</Card.Title>
                  <Card.Title as="h5">{data.address}</Card.Title>
                </div>
                <div className="modal-p2">
                  <Maps CoOrdinates={[data.latitude, data.longitude]} />
                </div>
              </div>
            )) : <></>
          }
        </Modal>


        {/*  Push Notification Modal  */}
        <Modal title="Push Notification" visible={PushNotification} onOk={handleOk} onCancel={handleCancel} okText='Send' >
        <input placeholder='Title...' className='U-input' />
        <textarea placeholder='Message...' className='U-input U-textarea' />
        </Modal>
      </Container>
      </div>
      </div>
    </>
  );
}

export default UserM;
