import React, { useState, useEffect } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { Carousel } from 'antd';
import { useNavigate } from 'react-router'
import { useDispatch } from "react-redux";

import { ProductData } from '../Redux/Actions/ProductDetails'
import { url, header } from '../Constant/Constant'

import '../Style/ProductDetails.css'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


function ProductDetails() {
    
    const [image, setImage] = React.useState(sidebarImage);
    const [color, setColor] = React.useState("black");
    const [hasImage, setHasImage] = React.useState(true);


    const [ProductDetails, setProductDetails] = useState('')
    const ProductId = localStorage.getItem('PS-Product-id')
    const history = useNavigate()
    const dispatch = useDispatch()

    
    if(sessionStorage.getItem('PS-isLogedIn') === 'false'){
        history('/')
      }

    useEffect(() => {
        fetch(`${url}/api/viewProduct`, {
            method: 'POST',
            body: JSON.stringify({
                id: ProductId
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                setProductDetails(data.doc)
                dispatch(ProductData(data.doc))
                console.log(data.doc)
            })
    }, [])


    return (
        <>
            <div className="wrapper">
            <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
            <div className="main-panel">
            <AdminNavbar />
            <Container fluid>
                <Card className="strpied-tabled-with-hover">
                    <Card.Header>
                        <Card.Title as="h4">Product Details</Card.Title>
                        <Button onClick={()=> history('/admin/EditProduct')} className='C-btn C-view PD-edit'>Edit</Button>
                    </Card.Header>
                    {
                        ProductDetails ? ProductDetails && (

                            <Card.Body className="table-full-width table-responsive px-0">
                                <div className='PD-Carousal-div'>
                                    <Carousel className='PD-carousal' >
                                        {
                                            ProductDetails.images.map((data, index) => (
                                                <div key={index}>
                                                    <img alt='Product Images' src={url+'/api/getFile'+data} className='PD-images' />
                                                </div>
                                            ))
                                        }
                                    </Carousel>
                                </div>
                                <div className='PD-Detail-div'>
                                    <Card className='PD-Card card1'>
                                        <h3 className='PD-headings PD-title'> title : <span className='PD-values'> {ProductDetails.title} </span> </h3>
                                        <h3 className='PD-headings'> Brand : <span className='PD-values'> {ProductDetails.brand.name} </span> </h3>
                                    </Card>
                                    <Card className='PD-Card card2'>
                                        <h3 className='PD-headings'> Stock : <span className='PD-values'> {ProductDetails.stock} </span> </h3>
                                        <h3 className='PD-headings'> views : <span className='PD-values'> {ProductDetails.views} </span> </h3>
                                        <h3 className='PD-headings'> Sold : <span className='PD-values'> {ProductDetails.sold} </span> </h3>
                                    </Card>
                                    <Card className='PD-Card card3'>
                                        <div className='PD-c3-div'>
                                            <Card className='c3-Acard'>
                                                <h3 className='PD-headings'> Actual Cost : <span className='PD-values'> {ProductDetails.actualCost} DZD</span> </h3>
                                            </Card>
                                            <Card className='c3-Fcard'>
                                                <h3 className='PD-headings'> Fake Cost : <span className='PD-values'> {ProductDetails.fakeCost} DZD</span> </h3>
                                            </Card>
                                            <Card className='c3-Scard'>
                                                <h3 className='PD-headings'> Size : <span className='PD-values'> {ProductDetails.size} </span> </h3>
                                            </Card>
                                            <Card className='c3-Fcard'>
                                                <h3 className='PD-headings'> Form : <span className='PD-values'> {ProductDetails.form} </span> </h3>
                                            </Card>
                                        </div>
                                    </Card>
                                    <Card className='PD-Card card4'>
                                        <h3 className='PD-headings PD-category'> Category : <span className='PD-values'> {ProductDetails.category === null ? 'No Category' : ProductDetails.category.name} </span> </h3>
                                        <h3 className='PD-headings PD-Sub'> Sub Category :
                                        </h3>
                                        <div className='PD-sub'>
                                            {
                                                ProductDetails.category === null ? 'No Subcategory':

                                                    <Card className='PD-subC'><span className='PD-values'> {ProductDetails.itemSubCategory.name} </span></Card>
                                            }
                                        </div>

                                    </Card>
                                    <div className='PD-div'>
                                        <Card className='PD-desc'>
                                            <Card.Title className='PD-headings2'> Description </Card.Title>
                                            <Card.Body>
                                                <p>
                                                    {ProductDetails.description}
                                                </p>
                                            </Card.Body>
                                        </Card>
                                        <Card className='PD-htu'>
                                            <Card.Title className='PD-headings2'> How to use </Card.Title>
                                            <Card.Body>
                                                <p>{ProductDetails.howToUse}</p>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                            </Card.Body>
                        ) : <></>
                    }

                </Card>
            </Container>
            </div>
            </div>
        </>
    );
}

export default ProductDetails;
