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
import React, { Component } from "react";
import { useLocation, NavLink } from "react-router-dom";

import { Nav } from "react-bootstrap";

// import logo from "../../assets/img/Logo.png";
import Pharmashop from "../../assets/img/PHARMASHOP.png";
import BackgroundImage from "../../assets/img/bk.jpg";
import Logo from "../../assets/img/Logo.png";

function Sidebar({ color, image, routes }) {
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  return (
    <div className="sidebar" data-image={BackgroundImage} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + BackgroundImage + ")",
          backgroundRepeat:'no-repeat',
          background:'center'
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
      
            <div className="logo-img">
              <img
                src={require("../../assets/img/Logo.png")}
                alt="..."
                style={{marginBottom:'7px'}}
              />
            </div>
            <img src={Pharmashop} style={{width:'160px'}} alt='Pharma Shop' />
      
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (key === 9) { return null }
            if (key === 10) { return null }
            if (key === 11) { return null }
            if (key === 12) { return null }
            if (key === 13) { return null }
            if (key === 15) { return null }
            if (!prop.redirect)
              return (
                <li
                  className={
                    prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path)
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
