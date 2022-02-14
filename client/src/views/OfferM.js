import React, { useState, useEffect } from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Modal, Spin, Image, Pagination, DatePicker } from 'antd';
import { DropzoneArea } from 'material-ui-dropzone';
import { LoadingOutlined } from '@ant-design/icons';

import { url, header } from '../Constant/Constant'

import '../Style/OfferM.css'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


function OfferM() {

    const [image, setImage] = React.useState(sidebarImage);
    const [color, setColor] = React.useState("black");
    const [hasImage, setHasImage] = React.useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [AddOfferName, setAddOfferName] = useState('')
    const [AddOfferTill, setAddOfferTill] = useState('')
    const [AddDiscount, setAddDiscount] = useState('')
    const [AddOfferImage, setAddOfferImage] = useState(null)
    const [CurrentPage, setCurrentPage] = useState(1)
    const [GetTotalPages, setGetTotalPages] = useState('')
    const history = useNavigate()
    const [Offerdata, setOfferdata] = useState([])
    const [initailarray, setinitailarray] = useState([])
    const [SearchName, setSearchName] = useState('')

    if (sessionStorage.getItem('PS-isLogedIn') === 'false') {
        history('/')
    }

    const OnPaginationchange = (current) => {
        setCurrentPage(current)
    }

    const onDateChange = (date, dateString) => {
        console.log(date);
        setAddOfferTill(dateString)
    }

    useEffect(() => {
        fetch(`${url}/api/getAllOfers${CurrentPage}`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                setOfferdata(data.doc.data)
                setGetTotalPages(data.doc.pages)
                setinitailarray(data.doc.data)
                console.log(data.doc.data)
            })
    }, [])

    // Add new Category Modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        // Create Offer 
        const data = new FormData();
        data.append('name', AddOfferName)
        data.append('validTill', AddOfferTill)
        data.append('discountPercent', AddDiscount)
        data.append('fileData', AddOfferImage)
        fetch(`${url}/api/addOffer`, {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(success => {
                console.log(success)
                setOfferdata([...Offerdata, success.doc])
            })
        setAddOfferName('')
        setAddDiscount('')
        setAddOfferTill('')
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // On Enabled and Disabled Button click
    const OnEnabledBtn = (id, boolean) => {
        fetch(`${url}/api/updateOfferStatus`, {
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                enabled: boolean
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const arr = Offerdata.map(item => {
                    if (item._id === data.doc._id) {
                        return data.doc
                    }
                    else {
                        return item
                    }
                })
                setOfferdata(arr)
            })
    }


    const OnSearch = () => {
        let value = SearchName
        if (value !== ''){
            let result = Offerdata.filter((data) => {
                return data.name.toLowerCase().startsWith(value.toLowerCase());
            })
            setOfferdata(result)
        }else{
            setOfferdata(initailarray)
        }
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
                    <button className='C-view add-new-btn' onClick={showModal}>Create Offer</button>
                    <Modal style={{ top: 30 }} title="Create New Offer" visible={isModalVisible} onOk={() => handleOk()} okText='Create' onCancel={handleCancel}>
                        <input value={AddOfferName} onChange={e => setAddOfferName(e.target.value)} className='C-input' placeholder='Name...' />
                        <input value={AddDiscount} onChange={e => setAddDiscount(e.target.value)} className='C-input' placeholder='Discount...' />
                        <DatePicker className='Offer-date' onChange={onDateChange} />
                        <DropzoneArea
                            filesLimit={1}
                            acceptedFiles={['image/*']}
                            dropzoneText={"Upload Category Images"}
                            onChange={(files) => {
                                console.log('Files:', files)
                                setAddOfferImage(files[0])
                            }}
                        />
                    </Modal>
                </div>
                <Row>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Offer Management</Card.Title>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th className="border-0">Image</th>
                                            <th className="border-0">Title</th>
                                            <th className="border-0">Offer Created</th>
                                            <th className="border-0">Offer Till</th>
                                            <th className="border-0">Discount</th>
                                            <th className="border-0"> Current Status </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Offerdata ? Offerdata && Offerdata.map(data => (
                                                <tr key={data._id}>
                                                    <td><Image src={`${url}/api/getFile${data.coverImage}`} alt='Pic' className='C-pic' /></td>
                                                    <td>{data.name ? data.name : 'No Title'}</td>
                                                    <td>{data.createdDate ? data.createdDate.slice(0, 10) : 'No Date'}</td>
                                                    <td>{data.validTill ? data.validTill.slice(0, 10) : 'No Date'}</td>
                                                    <td>{data.discountPercent ? `${data.discountPercent}%` : 'No %'}</td>
                                                    <td>
                                                        {data.enabled
                                                            ? (<Button onClick={() => OnEnabledBtn(data._id, false)} className="btn-fill pull-right U-btn UB-btn" type="submit" variant="info" > Enabled </Button>)
                                                            : (<Button onClick={() => OnEnabledBtn(data._id, true)} className="btn-fill pull-right U-btn " type="submit" variant="info" > Disabled </Button>)}
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

export default OfferM;
