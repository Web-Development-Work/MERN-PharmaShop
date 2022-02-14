import React, { useState } from "react";
import { Button, Card, Table, Container } from "react-bootstrap";
import { AutoComplete, Image, message } from 'antd';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router'

import { url, header } from '../Constant/Constant'

import '../Style/OrderRequest.css'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


const { Option } = AutoComplete;

function OrderItem() {

    const [image, setImage] = React.useState(sidebarImage);
    const [color, setColor] = React.useState("black");
    const [hasImage, setHasImage] = React.useState(true);


    const [Quantity, setQuantity] = useState('')
    const [AddItem, setAddItem] = useState([])
    const [result, setResult] = useState([]);
    const [itemPrice, setitemPrice] = useState('')
    const [ItemName, setItemName] = useState('')
    const [ItemId, setItemId] = useState('')
    const [ZoneCharges, setZoneCharges] = useState('')
    const OrderItemData = useSelector(state => state.OrderReducer.OrderRequestData)
    const history = useNavigate()

    if(sessionStorage.getItem('PS-isLogedIn') === 'false'){
        history('/')
      }

    const handleSearch = (value) => {
        let res = [];
        fetch(`${url}/api/searchProducts`, {
            method: 'POST',
            body: JSON.stringify({
                title: value
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.message === 'Success') {
                    if (!value || value.indexOf('@') >= 0) {
                        res = [];
                    } else {
                        // res = data.doc.map((domain) => `${domain}`);
                        setResult(data.doc);
                    }
                }
            }
            )
    };

    const OnInputcomplete = (value,children) => {
        console.log(value)
        setItemName(value)
        setitemPrice(children.UnitPrice)
        setItemId(children.ItemId)
    }


    const OnAddlist = () => {
        setAddItem([...AddItem,
        {
            itemName: ItemName,
            unitPrice: itemPrice,
            quantity: Quantity,
            total: Quantity * itemPrice,
            item: ItemId
        }
        ])
    }
    console.log(AddItem)

    var totalprice = AddItem.map(data => data.total).reduce((a, b) => a + b, 0)
    // console.log(totalprice)

    const onSavebtn = () => {
        fetch(`${url}/api/createOrder`, {
            method: 'POST',
            body: JSON.stringify({
                user: OrderItemData ? OrderItemData.user._id : '',
                items:AddItem,
                total:totalprice,
                zoneCharges:ZoneCharges,
                addressDetails:{
                    address: OrderItemData.deliveryAddress.address ,
                    location:[OrderItemData.deliveryAddress.longitude,OrderItemData.deliveryAddress.latitude],
                    zone:OrderItemData.deliveryAddress._id
                }
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if(data.message === 'Success'){
                    setAddItem([])
                    setQuantity('')
                    setZoneCharges('')
                    history('/admin/OrderRequest')
                }else{
                    message.error('Fill all Fields')
                }
            })
            
    }

    return (
        <>
            <div className="wrapper">
            <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
            <div className="main-panel">
            <AdminNavbar />
            <Container fluid>
                <Card.Title as="h4">Perception</Card.Title>
                <div className='OI-div2'>
                    { OrderItemData.images ? OrderItemData.images.map(data => (
                        <div className='OI-div1'>
                            <Image className='OI-images' src={`${url}/api/getFile${data}`} alt='Preception image' />
                        </div>
                    )) : <div className='OI-div2'> 
                    <div className='OI-div1'>
                    <Image className='OI-images' width={200} src="error" fallback="data:image/png;base64,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" /> 
                  </div>
                  </div>
                }
                </div>
                <Card.Title as="h4">Delivery Charges</Card.Title>
                 <input value={ZoneCharges} onChange={e => setZoneCharges(e.target.value)} type='number' placeholder='Charges...' className='OI-input' /> 
                <Card.Title as="h4">Items</Card.Title>

                <Table className="table-hover table-striped">
                    <tbody>
                        <tr>
                            <td>
                                <AutoComplete className='OI-input2' onChange={OnInputcomplete} onSearch={handleSearch} placeholder="Name...">
                                    {result.map((value) => (
                                        <Option key={value} UnitPrice={value.actualCost} ItemId={value._id} value={value.title}>
                                            {value.title}
                                        </Option>
                                    ))}
                                </AutoComplete>
                            </td>
                            <td> <input value={Quantity} onChange={e => setQuantity(e.target.value)} type='number' placeholder='Quantity' className='OI-input' /> </td>
                            <td> <Button onClick={OnAddlist} className='btn-fill pull-right Z-btn OI-btn'>+</Button> </td>
                        </tr>
                    </tbody>
                </Table>

                <Table className="table-hover table-striped">
                    <thead>
                        <tr>
                            <th className="border-0">Item</th>
                            <th className="border-0">Unit Price</th>
                            <th className="border-0">Quantity</th>
                            <th className="border-0">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AddItem ? AddItem &&
                            AddItem.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.itemName}</td>
                                    <td>{data.unitPrice}</td>
                                    <td>{data.quantity}</td>
                                    <td>{data.total}</td>
                                </tr>
                            )) : <></>
                        }
                    </tbody>
                </Table>
                <div className='OI-div'>
                    <h3> Gross Total : {totalprice} </h3>
                    <Button onClick={onSavebtn} className='btn-fill pull-right O-view-btn O-btn' >Save</Button>

                </div>

            </Container>
            </div>
            </div>
        </>
    );
}

export default OrderItem;
