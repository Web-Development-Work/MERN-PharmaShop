/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Routes} from "react-router-dom";
import { Provider } from "react-redux";
import Store from './Redux/Store';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLayout from "./layouts/Admin";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import UserM from "./views/UserM";
import CategoryM from "./views/CategoryM";
import BrandM from "./views/BrandM";
import ProductM from "./views/ProductM";
import OrderM from "./views/OrderM";
import OrderRequest from "./views/OrderRequest";
import ZonesM from "./views/ZonesM";
import FAQs from "./views/FAQs";
import OfferM from "./views/OfferM";
import SubCategory from "./views/SubCategory";
import ProductForm from "./views/ProductForm";
import ProductDetails from "./views/ProductDetails";
import OrderItem from "./views/OrderItem";
import EditProduct from "./views/EditProduct";
import NotificationM from "./views/NotificationM";

ReactDOM.render(
  <Provider store={Store}>
  <BrowserRouter>
    <Routes>
      <Route path="/admin" element={<AdminLayout />} />
      {/* <Redirect from="/admin" to="/admin/dashboard" /> */}
      <Route path='/login' element={<Login/>} />
      <Route path="/admin/Dashboard" element={<Dashboard />}/>
      <Route path="/admin/UserManagement" element={<UserM/>}/>
      <Route path="/admin/CategoryManagement" element={<CategoryM/>}/>
      <Route path="/admin/SubCategory" element={<SubCategory/>}/>
      <Route path="/admin/BrandManagement" element={<BrandM/>}/>
      <Route path="/admin/ProductsManagement" element={<ProductM/>}/>
      <Route path="/admin/ProductForm" element={<ProductForm/>}/>
      <Route path="/admin/ProductDetails" element={<ProductDetails/>}/>
      <Route path="/admin/EditProduct" element={<EditProduct/>}/>
      <Route path="/admin/OrderManagement" element={<OrderM/>}/>
      <Route path="/admin/OrderRequest" element={<OrderRequest/>}/>
      <Route path="/admin/OrderItem" element={<OrderItem/>}/>
      <Route path="/admin/ZonesManagement" element={<ZonesM/>}/>
      <Route path="/admin/FAQsManagement" element={<FAQs/>}/>
      <Route path="/admin/OfferManagement" element={<OfferM/>}/>
      <Route path="/admin/NotificationManagement" element={<NotificationM/>}/>
   
   
    </Routes>
  </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
