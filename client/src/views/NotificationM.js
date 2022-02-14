import React, { useEffect, useState } from "react";
import { Modal, Pagination } from 'antd';
import { Container, Table } from "react-bootstrap";
import { useNavigate } from 'react-router'

import { url, header } from '../Constant/Constant'
import Maps from "./Maps";
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";



const NotificationM = () => {

    const [image, setImage] = React.useState(sidebarImage);
    const [color, setColor] = React.useState("black");
    const [hasImage, setHasImage] = React.useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [NotificationData, setNotificationData] = useState('')
    const [OrderData, setOrderData] = useState('')
    const [CurrentPage, setCurrentPage] = useState(1)
    const [GetTotalPages, setGetTotalPages] = useState('')
    const history = useNavigate()

    // Get Brand Data
    useEffect(() => {
        fetch(`${url}/api/getNotifications${CurrentPage}`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setNotificationData(data.doc.data)
                setGetTotalPages(data.doc.pages)
            })
    }, [CurrentPage])

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

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const OnPaginationchange = (current) => {
        setCurrentPage(current)
    }

    return (
        <>
            <div className="wrapper">
            <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
            <div className="main-panel">
            <AdminNavbar />
            <Container fluid>
            <div className='Notification-container'>
                <h2>All Notifications</h2>
                <div className='List'>
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
                </div>

            </div>
            <div className='P-pagination'>
                <Pagination onChange={OnPaginationchange} showSizeChanger defaultCurrent={1} total={GetTotalPages * 10} />
            </div>


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
                                <p>{OrderData.addressDetails.zone !== null ? OrderData.addressDetails.zone.name : 'null'}</p>
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
            </Container>
            </div>
            </div>

        </>
    )
}

export default NotificationM
