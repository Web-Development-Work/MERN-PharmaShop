import React, { useState, useEffect } from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { Modal, Spin } from 'antd';
import Maps from './Maps'
import {useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons';

import { url, header } from '../Constant/Constant'
import '../Style/ZonesM.css'
import MapMarker from "./MapMarker";
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";

function ZonesM() {
    const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [FormModalVisible, setFormModalVisible] = useState(false);
    const [From, setFrom] = useState(0)
    const [To, setTo] = useState(0)
    const [Prize, setPrize] = useState(0)
    const [Addrange, setAddrange] = useState([])
    const [GetZonesData, setGetZonesData] = useState('')
    const [getgeometrybtn, setgetgeometrybtn] = useState([])
    const [rangebtn, setrangebtn] = useState('')
    const [FormInput, setFormInput] = useState('')
    const Formlat = localStorage.getItem('PS-lat')
    const Formlng = localStorage.getItem('PS-lng')
    const [SearchName, setSearchName] = useState('')
    const history =useNavigate()

    if (sessionStorage.getItem('PS-isLogedIn') === 'false') {
        history('/')
    }

    // Get Zones Data
    useEffect(() => {
        fetch(`${url}/api/getAllZones`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                setGetZonesData(data.doc)
                console.log(data.doc)
            })
    }, [])

    const showModal = (map, deliveryRange) => {
        setIsModalVisible(true);
        setgetgeometrybtn(map)
        setrangebtn(deliveryRange)
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const FormshowModal = () => {
        setFormModalVisible(true);
    };

    const FormhandleOk = () => {
        setFormModalVisible(false);
        fetch(`${url}/api/addZone`, {
            method: 'POST',
            body: JSON.stringify({
                name: FormInput,
                longitude: Formlng,
                latitude: Formlat,
                deliveryRange: Addrange
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.doc)
                setGetZonesData([...GetZonesData, data.doc])
            })
    };

    const FormhandleCancel = () => {
        setFormModalVisible(false);
    };

    const OnAddlist = () => {
        setAddrange([...Addrange,
        {
            from: From,
            to: To,
            charges: Prize
        }
        ])
    }


    // On click Disabled Button this api calls
    const onEnabledBtn = (i) => {
        fetch(`${url}/api/disableZone`, {
            method: 'PUT',
            body: JSON.stringify({
                id: i
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const arr = GetZonesData.map(item => {
                    if (item._id === data.doc._id) {
                        return data.doc
                    }
                    else {
                        return item
                    }
                })
                setGetZonesData(arr)
            }
            )
    }

    // On click Enabled Button this api calls
    const onDisabledBtn = (i) => {
        fetch(`${url}/api/enableZone`, {
            method: 'PUT',
            body: JSON.stringify({
                id: i
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const arr = GetZonesData.map(item => {
                    if (item._id === data.doc._id) {
                        return data.doc
                    }
                    else {
                        return item
                    }
                })
                setGetZonesData(arr)
            }
            )
    }

    const OnSearch = () => {
        fetch(`${url}/api/searchBrands`, {
            method: 'POST',
            body: JSON.stringify({
                name: SearchName
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.message === 'Success') {
                    setGetZonesData(data.doc)
                }
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
                <div className='U-search'>
                    <input value={SearchName} onChange={e => setSearchName(e.target.value)} placeholder='Search...' className='U-input' />
                    <i onClick={OnSearch} className="nc-icon nc-zoom-split search-icon"></i>
                </div>
                <div className='C-add-div'>
                    <button className='C-view add-new-btn' onClick={FormshowModal}>Add New</button>
                </div>
                <Row>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Zones Management</Card.Title>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th className="border-0">Name</th>
                                            <th className="border-0">Current Status</th>
                                            <th className="border-0">Price Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            GetZonesData ? GetZonesData && GetZonesData.map(data => (
                                                <tr key={data._id}>
                                                    <td> {data.name} </td>
                                                    <td>
                                                        {data.enabled
                                                            ? (<Button onClick={() => onEnabledBtn(data._id)} className="btn-fill pull-right U-btn UB-btn" type="submit" variant="info" > Enabled </Button>)
                                                            : (<Button onClick={() => onDisabledBtn(data._id)} className="btn-fill pull-right U-btn" type="submit" variant="info" > Disabled </Button>)}
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => showModal(data.geometry, data.deliveryRange)} className='btn-fill pull-right Z-btn'>View Prize Range</Button>
                                                    </td>
                                                </tr>
                                            )) : <tr>
                                                    <td> <Spin indicator={antIcon} /> </td>
                                                    <td> <Spin indicator={antIcon} /> </td>
                                                    <td> <Spin indicator={antIcon} /> </td>
                                                </tr>
                                        }
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Modal title="Prize Range" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Maps CoOrdinates={getgeometrybtn ? getgeometrybtn.coordinates : null} />
                    <Card.Title as="h4">Price range</Card.Title>
                    <Table className="table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="border-0">From</th>
                                <th className="border-0">To</th>
                                <th className="border-0">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rangebtn ? rangebtn && rangebtn.map(data => (
                                    <tr key={data._id}>
                                        <td> {data.from} </td>
                                        <td> {data.to} </td>
                                        <td> {data.charges} DZD </td>
                                    </tr>
                                )) : <></>
                            }

                        </tbody>
                    </Table>
                </Modal>
                <Modal title="Zone Form" visible={FormModalVisible} onOk={FormhandleOk} okText='Save' onCancel={FormhandleCancel}>
                    <input value={FormInput} onChange={e => setFormInput(e.target.value)} className='Z-input' placeholder='Name...' />
                    <Card.Title as="h4">Select Location</Card.Title>
                    <MapMarker />
                    <Card.Title as="h4">Price range</Card.Title>
                    <Table className="table-hover table-striped">
                        <tbody>
                            <tr>
                                <td> <input value={From} onChange={e => setFrom(e.target.value)} type='number' placeholder='From...' className='Z-input Z-input2' /> </td>
                                <td> <input value={To} onChange={e => setTo(e.target.value)} type='number' placeholder='To...' className='Z-input Z-input2' /> </td>
                                <td> <input value={Prize} onChange={e => setPrize(e.target.value)} type='number' placeholder='Prize...' className='Z-input Z-input2' /> </td>
                                <td> <Button onClick={OnAddlist} className='btn-fill pull-right Z-btn'>+</Button> </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Table className="table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="border-0">From</th>
                                <th className="border-0">To</th>
                                <th className="border-0">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Addrange ? Addrange &&
                                Addrange.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.from}</td>
                                        <td>{data.to}</td>
                                        <td>{data.charges}</td>
                                    </tr>
                                )) : <></>
                            }
                        </tbody>
                    </Table>
                </Modal>

            </Container>
            </div>
            </div>
        </>
    );
}

export default ZonesM;
