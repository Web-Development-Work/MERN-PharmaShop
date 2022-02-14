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
import Dashboard from "./views/Dashboard";
import UserM from './views/UserM'
import CategoryM from './views/CategoryM'
import SubCategory from "./views/SubCategory";
import ProductM from "./views/ProductM";
import ProductForm from "./views/ProductForm";
import ProductDetails from "./views/ProductDetails";
import OrderM from "./views/OrderM";
import ZonesM from "./views/ZonesM";
import FAQs from "./views/FAQs";
import OrderRequest from "./views/OrderRequest";
import OrderItem from "./views/OrderItem";
import BrandM from "./views/BrandM";
import EditProduct from "./views/EditProduct";
import OfferM from "./views/OfferM";
import NotificationM from "./views/NotificationM";

const dashboardRoutes = [
  {
    path: "/Dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/UserManagement",
    name: "User Management",
    icon: "nc-icon nc-circle-09",
    component: UserM,
    layout: "/admin",
  },
  {
    path: "/CategoryManagement",
    name: "Category Management",
    icon: "nc-icon nc-grid-45",
    component: CategoryM,
    layout: "/admin",
  },
  {
    path: "/BrandManagement",
    name: "Brand Management",
    icon: "nc-icon nc-tag-content",
    component: BrandM,
    layout: "/admin",
  },
  {
    path: "/ProductsManagement",
    name: "Products Management",
    icon: "nc-icon nc-layers-3",
    component: ProductM,
    layout: "/admin",
  },
  {
    path: "/OrderManagement",
    name: "Order Management",
    icon: "nc-icon nc-paper-2",
    component: OrderM,
    layout: "/admin",
  },
  {
    path: "/OrderRequest",
    name: "Order Request",
    icon: 'nc-icon nc-bullet-list-67',
    component: OrderRequest,
    layout: "/admin",
  },
  {
    path: "/ZonesManagement",
    name: "Zones Management",
    icon: "nc-icon nc-map-big",
    component: ZonesM,
    layout: "/admin",
  },
  {
    path: "/FAQsManagement",
    name: "FAQs Management",
    icon: "nc-icon nc-quote",
    component: FAQs,
    layout: "/admin",
  },
  {
    path: "/SubCategory",
    name: "Sub Category",
    component: SubCategory,
    layout: "/admin",
  },
  {
    path: "/ProductForm",
    name: "Product Form",
    component: ProductForm,
    layout: "/admin",
  },
  {
    path: "/ProductDetails",
    name: "Product Details",
    component: ProductDetails,
    layout: "/admin",
  },
  {
    path: "/OrderItem",
    name: "Order Item",
    component: OrderItem,
    layout: "/admin",
  },
  {
    path: "/EditProduct",
    name: "Edit Product",
    component: EditProduct,
    layout: "/admin",
  },
  {
    path: "/OfferManagement",
    name: "Offer Management",
    icon: "nc-icon nc-bulb-63",
    component: OfferM,
    layout: "/admin",
  },
  {
    path: "/NotificationManagement",
    name: "Notification Management",
    icon: "nc-icon nc-notification-70",
    component: NotificationM,
    layout: "/admin",
  }
];

export default dashboardRoutes;
