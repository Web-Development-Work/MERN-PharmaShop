import React, { useState, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Switch, Select , message } from 'antd';
import { DropzoneArea } from 'material-ui-dropzone';


import { url, header } from '../Constant/Constant'
import '../Style/ProductForm.css'
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import sidebarImage from "../assets/img/sidebar-3.jpg";
import AdminNavbar from "../components/Navbars/AdminNavbar";



const { Option } = Select;

function ProductForm() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const [Title, setTitle] = useState()
  const [HowToUse, setHowToUse] = useState('')
  const [Description, setDescription] = useState('')
  const [Stock, setStock] = useState('')
  const [Size, setSize] = useState('')
  const [Form, setForm] = useState('')
  const [ActualCost, setActualCost] = useState('')
  const [FakeCost, setFakeCost] = useState('')
  const [ProductType, setProductType] = useState('')
  const [Images, setImages] = useState('')
  const [FormCategory, setFormCategory] = useState('')
  const [FormSUbCategories, setFormSUbCategories] = useState('')
  const [FormBrand, setFormBrand] = useState('')
  const [CategoryApi, setCategoryApi] = useState('')
  const [SubCategoryApi, setSubCategoryApi] = useState('')
  const [BrandApi, setBrandApi] = useState('')
  const history = useNavigate()

  if(sessionStorage.getItem('PS-isLogedIn') === 'false'){
    history('/')
  }

  // Get Products API
  useEffect(() => {
    fetch(`${url}/api/getAllCategories`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        setCategoryApi(data.doc.map(data => data))
      })

      fetch(`${url}/api/getBrands`, {
        method: 'POST',
      })
        .then(res => res.json())
        .then(data => {
          setBrandApi(data.doc.map(data => data))
        })

  }, [])

  const onCategoryChange = (value,children) => {
    console.log(`selected ${value}`);
    setSubCategoryApi(children.data.subcategories)
    setFormCategory(children.id)
  }

  const onSubCategoryChange = (value,children) => {
    console.log(`selected ${value}`);
    setFormSUbCategories(children.id)
  }

  const onBrandChange = (value,children) => {
    console.log(`selected ${value}`);
    setFormBrand(children.id)
  }


  const OnFormSave = () => {
    const data = new FormData();
    Images.map(img => {
      data.append('files', img)
    })
    data.append('title', Title)
    data.append('brand',FormBrand)
    data.append('howToUse', HowToUse)
    data.append('description', Description)
    data.append('category',FormCategory)
    data.append('subcategory',FormSUbCategories)
    data.append('stock', parseInt(Stock))
    data.append('fakeCost', parseInt(FakeCost))
    data.append('actualCost', parseInt(ActualCost))
    data.append('size', Size)
    data.append('productType', ProductType)
    data.append('form', Form)

    fetch(`${url}/api/addProduct`, {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if(data.message === 'Success'){
          history('/admin/ProductsManagement')
          console.log(data)
        }else{
          message.error('Fill Form Correctly');
        }

      })
  };


  return (
    <>
      <div className="wrapper">
      <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
      <div className="main-panel">
      <AdminNavbar />
      <Container fluid>
        <Card className="strpied-tabled-with-hover">
          <Card.Header>
            <Card.Title as="h4">Product Form</Card.Title>
          </Card.Header>
          <Card.Body className="table-full-width table-responsive px-0">
            <div className='PF-form-div'>
              <input className='PF-inputs PF-title' value={Title} onChange={e => setTitle(e.target.value)} placeholder='Title...' />
              <div className='PF-d1'>
                <input className='PF-inputs PF-Brand' value={Form} onChange={e => setForm(e.target.value)} placeholder='Form...' />
                <input className='PF-inputs PF-Stock' type='number' value={Stock} onChange={e => setStock(e.target.value)} placeholder='Stock...' />
                <div className='enabled-div'>
                  <h3> Enabled : </h3>
                  <Switch disabled defaultChecked />
                </div>
              </div>
              <div className='PF-d1'>
                <input className='PF-inputs PF-FC' type='number' value={FakeCost} onChange={e => setFakeCost(e.target.value)} placeholder='Fake Cost...' />
                <input className='PF-inputs PF-AC' type='number' value={ActualCost} onChange={e => setActualCost(e.target.value)} placeholder='Actual Cost...' />
              </div>
              <div className='PF-d1'>
              <input className='PF-inputs PF-PT'  value={ProductType} onChange={e => setProductType(e.target.value)} placeholder='Product Type...' />
                <input className='PF-inputs PF-PT PF-S'  value={Size} onChange={e => setSize(e.target.value)} placeholder='Size...' />
              </div>
              <div className='PF-category' >
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Category..."
                  onChange={onCategoryChange}
                >
                  {
                    CategoryApi ? CategoryApi && CategoryApi.map(data => (
                      <Option value={data.name} id={data._id} data={data} > {data.name} </Option>
                      
                    )) : <></>
                  }
                </Select>

                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Sub Categories..."
                  onChange={onSubCategoryChange}
                >
                  {
                    SubCategoryApi ? SubCategoryApi && SubCategoryApi.map(data => (
                      <Option value={data.name} id={data._id}> {data.name} </Option>
                    )) : <></>
                  }
                </Select>

                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Brand..."
                  onChange={onBrandChange}
                >
                  {
                    BrandApi ? BrandApi && BrandApi.map(data => (
                      <Option value={data.name} id={data._id}> {data.name} </Option>
                    )) : <></>
                  }
                </Select>

              </div>
              <textarea placeholder='Description...' value={Description} onChange={e => setDescription(e.target.value)} className='PF-textarea' />
              <textarea placeholder='How to use...' value={HowToUse} onChange={e => setHowToUse(e.target.value)} className='PF-textarea tt2' />
            </div>
            <div className='PF-Upload-img'>
              <DropzoneArea
                acceptedFiles={['image/*']}
                dropzoneText={"Upload Product Images"}
                onChange={(files) => {
                  // console.log('Files:', files)
                  setImages(files)
                }}
              />
            </div>
            <button className='C-view PF-btn' onClick={OnFormSave} >Save</button>

          </Card.Body>
        </Card>
      </Container>
      </div>
      </div>
    </>
  );
}


export default ProductForm;
