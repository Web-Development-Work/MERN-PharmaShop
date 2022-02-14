import React, { useState, useEffect } from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { Pagination , Spin } from 'antd';
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from '@ant-design/icons';

import { url, header } from '../Constant/Constant'
import '../Style/ProductM.css'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


function ProductM() {
    
    const [image, setImage] = React.useState(sidebarImage);
    const [color, setColor] = React.useState("black");
    const [hasImage, setHasImage] = React.useState(true);

    const [GetProducts, setGetProducts] = useState('')
    const [CurrentPage, setCurrentPage] = useState(1)
    const [GetTotalPages, setGetTotalPages] = useState('')
    const history = useNavigate()

    if(sessionStorage.getItem('PS-isLogedIn') === 'false'){
        history('/')
      }

    const OnPaginationchange = (current) => {
        setCurrentPage(current)
    }

    useEffect(() => {
        DataFetch()
    }, [CurrentPage])

    const DataFetch = () => {
        fetch(`${url}/api/getProducts${CurrentPage}`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                setGetProducts(data.doc.products)
                setGetTotalPages(data.doc.pages)
                console.log(data.doc)
            })
    }

    // On Enabled Button click
    const OnEnabledBtn = (i) => {
        fetch(`${url}/api/disableProduct`, {
            method: 'PUT',
            body: JSON.stringify({
                id: i
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                DataFetch()
            }
            )
    }

    // On Disabled Button click
    const OnDisabledBtn = (i) => {
        fetch(`${url}/api/enableProduct`, {
            method: 'PUT',
            body: JSON.stringify({
                id: i
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                DataFetch()
            }
            )
    }


      // On Disabled Button click
      const OnDeleteBtn = (i) => {
        fetch(`${url}/api/deleteProduct`, {
            method: 'Delete',
            body: JSON.stringify({
                id: i
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                DataFetch()
            }
            )
    }

    const antIcon = <LoadingOutlined style={{ fontSize: 24 , color:'#58D68D' }} spin />
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
                    <button className='C-view add-new-btn' onClick={() => history('/admin/ProductForm')}>Add New</button>
                </div>
                <Row>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Product Management</Card.Title>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th className="border-0">Title</th>
                                            <th className="border-0">Sold</th>
                                            <th className="border-0">Views</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            GetProducts ? GetProducts && GetProducts.map(data => (
                                                <tr key={data._id}>
                                                    <td> {data.title} </td>
                                                    <td> {data.sold} </td>
                                                    <td> {data.views} </td>
                                                    <td className='view-btn-div'>
                                                        <Button className="btn-fill pull-right U-btn C-view P-btn P-view-btn" onClick={() => {
                                                            localStorage.setItem('PS-Product-id',data._id)
                                                            history.push('/admin/ProductDetails')
                                                            }} type="submit" variant="info" > View Details </Button>
                                                    </td>
                                                    <td>
                                                        {data.enabled ? (<Button onClick={() => OnEnabledBtn(data._id)} className="P-wi C-view">Enabled</Button>)
                                                            : (<Button onClick={() => OnDisabledBtn(data._id)} className="P-wi C-block">Disabled</Button>)}
                                                    </td>
                                                    <td>
                                                    <Button onClick={() => OnDeleteBtn(data._id)} className="P-wi C-block">Delete</Button>
                                                    </td>
                                                </tr>
                                            )) : 
                                            <tr>
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

export default ProductM;
