import React, { useState, useEffect } from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Modal, Spin, Image } from 'antd';
import { DropzoneArea } from 'material-ui-dropzone';
import { useDispatch } from "react-redux";
import { LoadingOutlined } from '@ant-design/icons';

import { url, header } from '../Constant/Constant'
import { CategoryData } from '../Redux/Actions/CategoryData'
import '../Style/CategoryM.css'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


function CategoryM() {
    const [image, setImage] = React.useState(sidebarImage);
    const [color, setColor] = React.useState("black");
    const [hasImage, setHasImage] = React.useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const history = useNavigate()
    const [Categorydata, setCategorydata] = useState([])
    const dispatch = useDispatch()
    const CategoryId = localStorage.getItem('PS-Update-Category-id')
    const [UpdateCategoryName, setUpdateCategoryName] = useState('')
    const [CategoryImage, setCategoryImage] = useState(null)
    const [AddCategoryName, setAddCategoryName] = useState('')
    const [AddCategoryImage, setAddCategoryImage] = useState(null)
    const [SearchName, setSearchName] = useState('')

    if (sessionStorage.getItem('PS-isLogedIn') === 'false') {
        history('/')
    }

    useEffect(() => {
        fetch(`${url}/api/getAllCategories`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                setCategorydata(data.doc)
                console.log(data.doc)
            })
    }, [])

    // Add new Category Modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        // Add Category 
        const data = new FormData();
        data.append('name', AddCategoryName)
        data.append('fileData', AddCategoryImage)
        fetch(`${url}/api/addCategory`, {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(success => setCategorydata([...Categorydata, success.doc]))
        setAddCategoryName('')
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Update Category Modal
    const showModal2 = (id) => {
        setIsModalVisible2(true);
        localStorage.setItem('PS-Update-Category-id', id)
    };


    const handleOk2 = () => {
        // Update Category Name
        setIsModalVisible2(false);
        fetch(`${url}/api/categoryName`, {
            method: 'PUT',
            body: JSON.stringify({
                id: CategoryId,
                name: UpdateCategoryName
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => console.log(data))
        setUpdateCategoryName('')

        // Update Category Image
        const data = new FormData();
        data.append('fileData', CategoryImage)
        data.append('id', CategoryId)
        fetch(`${url}/api/changeCategoryImage`, {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(data => {
                const arr = Categorydata.map(item => {
                    if (item._id === data.doc._id) {
                        return data.doc
                    }
                    else {
                        return item
                    }
                })
                setCategorydata(arr)
            })
    };

    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };


    // On Enabled and Disabled Button click
    const OnEnabledBtn = (id, boolean) => {
        fetch(`${url}/api/updateCategoryStatus`, {
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                status: boolean
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const arr = Categorydata.map(item => {
                    if (item._id === data.doc._id) {
                        return data.doc
                    }
                    else {
                        return item
                    }
                })
                setCategorydata(arr)
            })
    }


    const OnSearch = () => {
        fetch(`${url}/api/searchCategory`, {
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
                    setCategorydata(data.doc)
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
                    <button className='C-view add-new-btn' onClick={showModal}>Add New</button>
                    <Modal title="Add New Category" visible={isModalVisible} onOk={() => handleOk()} okText='Add' onCancel={handleCancel}>
                        <input value={AddCategoryName} onChange={e => setAddCategoryName(e.target.value)} className='C-input' placeholder='Name...' />
                        <DropzoneArea
                            filesLimit={1}
                            acceptedFiles={['image/*']}
                            dropzoneText={"Upload Category Images"}
                            onChange={(files) => {
                                console.log('Files:', files)
                                setAddCategoryImage(files[0])
                            }}
                        />
                    </Modal>
                </div>
                <Row>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Category Management</Card.Title>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th className="border-0">Image</th>
                                            <th className="border-0">Title</th>
                                            <th className="border-0"> Current Status </th>
                                            <th className="border-0">Update</th>
                                            <th className="border-0">SubCategory</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Categorydata ? Categorydata && Categorydata.map(data => (
                                                <tr key={data._id}>
                                                    <td><Image src={`${url}/api/getFile${data.image}`} alt='Pic' className='C-pic' /></td>
                                                    <td>{data.name ? data.name : 'No Title'}</td>
                                                    <td>
                                                        {data.enabled
                                                            ? (<Button onClick={() => OnEnabledBtn(data._id, false)} className="btn-fill pull-right U-btn UB-btn" type="submit" variant="info" > Enabled </Button>)
                                                            : (<Button onClick={() => OnEnabledBtn(data._id, true)} className="btn-fill pull-right U-btn " type="submit" variant="info" > Disabled </Button>)}
                                                    </td>
                                                    <td> <Button className="btn-fill pull-right U-viwbtn" onClick={() => showModal2(data._id)}>Update</Button> </td>
                                                    <td> <Button className="btn-fill pull-right U-btn UB-btn" onClick={() => dispatch(CategoryData(data, history))} >Sub Categories</Button> </td>
                                                </tr>
                                            )) : <tr>
                                                    <td> <Spin indicator={antIcon} /> </td>
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

                <Modal title="Update Category" visible={isModalVisible2} onOk={handleOk2} okText='Update' onCancel={handleCancel2}>
                    <input className='C-input' value={UpdateCategoryName} onChange={e => setUpdateCategoryName(e.target.value)} placeholder='Update Name...' />
                    <DropzoneArea
                        filesLimit={1}
                        acceptedFiles={['image/*']}
                        dropzoneText={"Update Category Images"}
                        onChange={(files) => {
                            // console.log('Files:', files[0])
                            setCategoryImage(files[0])
                        }}
                    />
                </Modal>
            </Container>
            </div>
            </div>
        </>
    );
}

export default CategoryM;
