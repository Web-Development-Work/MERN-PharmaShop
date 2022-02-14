import React, { useState, useEffect } from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { Modal, Spin, Image } from 'antd';
import { DropzoneArea } from 'material-ui-dropzone';
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons';

import { url, header } from '../Constant/Constant'
import '../Style/CategoryM.css'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


function BrandM() {
    const [image, setImage] = React.useState(sidebarImage);
    const [color, setColor] = React.useState("black");
    const [hasImage, setHasImage] = React.useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [AddBrandName, setAddBrandName] = useState('')
    const [AddBrandImage, setAddBrandImage] = useState(null)
    const [GetBrands, setGetBrands] = useState('')
    const [UpdateBrandName, setUpdateBrandName] = useState('')
    const [UpdateBrandImage, setUpdateBrandImage] = useState(null)
    const BrandId = localStorage.getItem('PS-Brand-id')
    const [SearchName, setSearchName] = useState('')
    const history = useNavigate()

    if (sessionStorage.getItem('PS-isLogedIn') === 'false') {
        history('/')
    }

    const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#58D68D' }} spin />


    // Get Brand Data
    useEffect(() => {
        fetch(`${url}/api/getBrands`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                setGetBrands(data.doc)
                // console.log(data.doc)
            })
    }, [])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        // Add Brand
        const data = new FormData();
        data.append('name', AddBrandName)
        data.append('fileData', AddBrandImage)
        fetch(`${url}/api/addBrand`, {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(success => setGetBrands([...GetBrands, success.doc]))
        setAddBrandName('')
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showModal2 = (id) => {
        setIsModalVisible2(true);
        localStorage.setItem('PS-Brand-id', id)
    };

    const handleOk2 = () => {
        setIsModalVisible2(false);
        // Update Brand Name
        setIsModalVisible2(false);
        fetch(`${url}/api/brandName`, {
            method: 'PUT',
            body: JSON.stringify({
                id: BrandId,
                name: UpdateBrandName
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => console.log(data))
        setUpdateBrandName('')

        // Update Brand Image
        const data = new FormData();
        data.append('fileData', UpdateBrandImage)
        data.append('id', BrandId)
        fetch(`${url}/api/changeBrandImage`, {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(data => {
                const arr = GetBrands.map(item => {
                    if (item._id === data.doc._id) {
                        return data.doc
                    }
                    else {
                        return item
                    }
                })
                setGetBrands(arr)
            })
    };

    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };

    // On Enabled Button click
    const OnEnabledBtn = (id) => {
        fetch(`${url}/api/disableBrand`, {
            method: 'PUT',
            body: JSON.stringify({
                id: id
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const arr = GetBrands.map(item => {
                    if (item._id === data.doc._id) {
                        return data.doc
                    }
                    else {
                        return item
                    }
                })
                setGetBrands(arr)
            })
    }

    // On Disabled Button click
    const OnDisabledBtn = (id) => {
        fetch(`${url}/api/enableBrand`, {
            method: 'PUT',
            body: JSON.stringify({
                id: id
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const arr = GetBrands.map(item => {
                    if (item._id === data.doc._id) {
                        return data.doc
                    }
                    else {
                        return item
                    }
                })
                setGetBrands(arr)
            })
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
                // console.log(data)
                if (data.message === 'Success') {
                    setGetBrands(data.doc)
                }
            }
            )
    }

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
                    <button className='C-view add-new-btn' onClick={showModal}>Add New</button>
                    <Modal title="Add New Brand" visible={isModalVisible} onOk={handleOk} okText='Add' onCancel={handleCancel}>
                        <input value={AddBrandName} onChange={e => setAddBrandName(e.target.value)} className='C-input' placeholder='Name...' />
                        <DropzoneArea
                            filesLimit={1}
                            acceptedFiles={['image/*']}
                            dropzoneText={"Upload Brand Images"}
                            onChange={(files) => {
                                console.log('Files:', files)
                                setAddBrandImage(files[0])
                            }}
                        />
                    </Modal>
                </div>


                <Row>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Brand Management</Card.Title>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th className="border-0">Image</th>
                                            <th className="border-0">Title</th>
                                            <th className="border-0"> Current Status </th>
                                            <th className="border-0">Update</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            GetBrands ? GetBrands && GetBrands.map(data => (
                                                <tr key={data._id}>
                                                    <td><Image src={`${url}/api/getFile${data.image}`} alt='Pic' className='C-pic' /></td>
                                                    <td>{data.name ? data.name : 'No Title'}</td>
                                                    <td>
                                                        {data.enabled
                                                            ? (<Button onClick={() => OnEnabledBtn(data._id, false)} className="btn-fill pull-right U-btn UB-btn" type="submit" variant="info" > Enabled </Button>)
                                                            : (<Button onClick={() => OnEnabledBtn(data._id, true)} className="btn-fill pull-right U-btn " type="submit" variant="info" > Disabled </Button>)}
                                                    </td>
                                                    <td> <Button className="btn-fill pull-right U-viwbtn" onClick={() => showModal2(data._id)}>Update</Button> </td>
                                                </tr>
                                            )) : <tr>
                                                    <td> <Spin indicator={antIcon} /> </td>
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
                <Modal title="Update Brand" visible={isModalVisible2} onOk={handleOk2} okText='Update' onCancel={handleCancel2}>
                    <input value={UpdateBrandName} onChange={e => setUpdateBrandName(e.target.value)} className='C-input' placeholder='Brand Name...' />
                    <DropzoneArea
                        filesLimit={1}
                        acceptedFiles={['image/*']}
                        dropzoneText={"Update Brand Images"}
                        onChange={(files) => {
                            console.log('Files:', files)
                            setUpdateBrandImage(files[0])
                        }}
                    />
                </Modal>
            </Container>
            </div>
            </div>
        </>
    );
}

export default BrandM;
