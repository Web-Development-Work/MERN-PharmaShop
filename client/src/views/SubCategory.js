import React, { useState } from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { Modal, Spin, Image } from 'antd';
import { DropzoneArea } from 'material-ui-dropzone';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons';

import { url, header } from '../Constant/Constant'

import '../Style/CategoryM.css'

import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


function SubCategory() {

    const [image, setImage] = React.useState(sidebarImage);
    const [color, setColor] = React.useState("black");
    const [hasImage, setHasImage] = React.useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [AddSubCategoryName, setAddSubCategoryName] = useState('')
    const [AddSubCategoryImage, setAddSubCategoryImage] = useState(null)
    const [UpdateSubCategoryName, setUpdateSubCategoryName] = useState('')
    const [UpdateSubCAtegoryImage, setUpdateSubCAtegoryImage] = useState(null)
    const [SubCategoryData, setSubCategoryData] = useState(useSelector(state => state.CategoryData.CategoryData.subcategories))
    const CategoryId = useSelector(state => state.CategoryData.CategoryData._id)
    const SubCategoryId = localStorage.getItem('PS-Update-SubCategory-id')
    const history = useNavigate()


    const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#58D68D' }} spin />

    if (sessionStorage.getItem('PS-isLogedIn') === 'false') {
        history('/')
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);

        // Add Sub Category 
        const data = new FormData();
        data.append('name', AddSubCategoryName)
        data.append('category', CategoryId)
        data.append('fileData', AddSubCategoryImage)
        fetch(`${url}/api/addSubcategory`, {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                // console.log(SubCategoryData)
                setSubCategoryData([...SubCategoryData, data.doc.subcategories[data.doc.subcategories.length - 1]])

            })
        setAddSubCategoryName('')
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showModal2 = (id) => {
        setIsModalVisible2(true);
        localStorage.setItem('PS-Update-SubCategory-id', id)
    };

    const handleOk2 = () => {
        setIsModalVisible2(false);

        // Update Sub Category Name
        fetch(`${url}/api/updateSubcategoryName`, {
            method: 'POST',
            body: JSON.stringify({
                id: CategoryId,
                name: UpdateSubCategoryName,
                subcategory: SubCategoryId
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => console.log(data))
        setUpdateSubCategoryName('')

        // Update Sub Category Image
        const data = new FormData();
        data.append('fileData', UpdateSubCAtegoryImage)
        data.append('id', CategoryId)
        data.append('subcategory', SubCategoryId)
        console.log('body', data)
        fetch(`${url}/api/changeSubcategoryImage`, {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(data => {
                console.log('response', data)
                setSubCategoryData(data.doc.subcategories)
            })
    };

    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };


    // On Enabled and Disabled Button click
    const OnEnabledBtn = (id, boolean) => {
        fetch(`${url}/api/updateSubCatStatus`, {
            method: 'PUT',
            body: JSON.stringify({
                subcategory: id,
                status: boolean,
                category: CategoryId
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setSubCategoryData(data.doc.subcategories)
            })
    }

    return (
        <>
             <div className="wrapper">
            <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
            <div className="main-panel">
            <AdminNavbar />
            <Container fluid>
                <div className='U-search'>
                    <input placeholder='Search...' className='U-input' />
                    <i className="nc-icon nc-zoom-split search-icon"></i>
                </div>
                <div className='C-add-div'>
                    <button className='C-view add-new-btn' onClick={showModal}>Add New</button>
                    <Modal title="Add New Sub Category" visible={isModalVisible} onOk={handleOk} okText='Add' onCancel={handleCancel}>
                        <input value={AddSubCategoryName} onChange={e => setAddSubCategoryName(e.target.value)} className='C-input' placeholder='Name...' />
                        <DropzoneArea
                            filesLimit={1}
                            acceptedFiles={['image/*']}
                            dropzoneText={"Upload Sub Category Images"}
                            onChange={(files) => {
                                console.log('Files:', files)
                                setAddSubCategoryImage(files[0])
                            }}
                        />
                    </Modal>
                </div>
                <Row>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Sub Category Management</Card.Title>
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
                                            SubCategoryData ? SubCategoryData && SubCategoryData.map(data => (
                                                <tr key={data._id}>
                                                    <td><Image src={`${url}/api/getFile${data.image}`} alt='Pic' className='C-pic' /></td>
                                                    <td>{data.name ? data.name : 'No Title'}</td>
                                                    <td>
                                                        {data.enabled
                                                            ? (<Button onClick={() => OnEnabledBtn(data._id, false)} className="btn-fill pull-right U-btn " type="submit" variant="info" > Enabled </Button>)
                                                            : (<Button onClick={() => OnEnabledBtn(data._id, true)} className="btn-fill pull-right U-btn UB-btn" type="submit" variant="info" > Disabled </Button>)}
                                                    </td>
                                                    <td> <Button className="btn-fill pull-right U-viwbtn" onClick={() => showModal2(data._id)}>Update</Button> </td>
                                                </tr>
                                            )) : <tr>
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

                <Modal title="Update Sub Category" visible={isModalVisible2} onOk={handleOk2} okText='Update' onCancel={handleCancel2}>
                    <input value={UpdateSubCategoryName} onChange={e => setUpdateSubCategoryName(e.target.value)} className='C-input' placeholder='Update Name...' />
                    <DropzoneArea
                        filesLimit={1}
                        acceptedFiles={['image/*']}
                        dropzoneText={"Update Sub Category Images"}
                        onChange={(files) => {
                            console.log('Files:', files)
                            setUpdateSubCAtegoryImage(files[0])
                        }}
                    />
                </Modal>
            </Container>
            </div>
            </div>
        </>
    );
}

export default SubCategory;
