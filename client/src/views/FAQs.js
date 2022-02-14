import React, { useState, useEffect } from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { Modal, Spin } from 'antd';
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons';

import { url, header } from '../Constant/Constant'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";


function FAQs() {

    const [image, setImage] = React.useState(sidebarImage);
    const [color, setColor] = React.useState("black");
    const [hasImage, setHasImage] = React.useState(true);
  
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [GetFAQs, setGetFAQs] = useState('')
    const [AddQuestion, setAddQuestion] = useState('')
    const [AddAnswer, setAddAnswer] = useState('')
    const history = useNavigate()

    const showModal = () => {
        setIsModalVisible(true);
    };

    if (sessionStorage.getItem('PS-isLogedIn') === 'false') {
        history('/')
    }

    const handleOk = () => {
        setIsModalVisible(false);
        fetch(`${url}/api/addFAQ`, {
            method: 'POST',
            body: JSON.stringify({
                question: AddQuestion,
                answer: AddAnswer
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.doc)
                setGetFAQs([...GetFAQs, data.doc])
            })
        setAddQuestion('')
        setAddAnswer('')
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Get FAQs Data
    useEffect(() => {
        fetch(`${url}/api/getAllFAQs`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                setGetFAQs(data.doc)
                console.log(data.doc)
            })
    }, [])

    const onFAQsRemove = (id) => {
        console.log(id)
        fetch(`${url}/api/deleteFAQ`, {
            method: 'DELETE',
            body: JSON.stringify({
                id: id
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const arr = GetFAQs.filter(item => item._id != data.doc._id)
                setGetFAQs(arr)
            })
    }

    const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#58D68D' }} spin />

    return (
        <>
             <div className="wrapper">
            <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
            <div className="main-panel">
            <AdminNavbar />
            <Container fluid>
                <div className='C-add-div'>
                    <button className='C-view add-new-btn' onClick={showModal} >Add New</button>
                </div>
                <Row>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">FAQs</Card.Title>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th className="border-0">Question</th>
                                            <th className="border-0">Answer</th>
                                            <th className="border-0"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {GetFAQs ? GetFAQs && GetFAQs.map(data => (
                                            <tr key={data._id}>
                                                <td>
                                                    <p> {data.question} </p>
                                                </td>
                                                <td>
                                                    <p> {data.answer} </p>
                                                </td>
                                                <td>
                                                    <Button onClick={() => onFAQsRemove(data._id)} className='btn-fill pull-right O-delete-btn'  > Remove </Button>
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
                <Modal title="Add FAQs" visible={isModalVisible} okText='Add' onOk={handleOk} onCancel={handleCancel}>
                    <textarea value={AddAnswer} onChange={e => setAddAnswer(e.target.value)} placeholder='Answer' className='PF-textarea' />
                    <textarea value={AddQuestion} onChange={e => setAddQuestion(e.target.value)} placeholder='Question' className='PF-textarea' />
                </Modal>
            </Container>
            </div>
            </div>
        </>
    );
}

export default FAQs;
