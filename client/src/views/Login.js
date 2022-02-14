import React, { useState } from 'react'
import {useNavigate } from 'react-router'
import { Button } from 'react-bootstrap'
import { message } from 'antd'

import { url, header } from '../Constant/Constant'
import logo  from '../assets/img/Logo.png'
import '../Style/Login.css'

const Login = () => {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const history =useNavigate()


    const OnLogin = () => {
        localStorage.setItem('PS-email', email)
        fetch(`${url}/api/adminLogin`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: header
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.message === 'Success') {
                    sessionStorage.setItem('PS-isLogedIn', true)
                    history('/admin/Dashboard')
                } else {
                    message.error('Invalid User')
                }
            })
    }

    return (
        <div className='L-main'>
            <div className='L-div'>
            <img src={logo} className='L-logo' draggable={false} />
                <h1 className='L-heading'>Login Here !</h1>
                <input type='email' value={email} onChange={e => setemail(e.target.value)} className='L-input' placeholder='Email' />
                <input type='password' value={password} onChange={e => setpassword(e.target.value)} className='L-input' placeholder='Password' />
                <button className=' L-btn' onClick={OnLogin} >Login</button>
            </div>
        </div>
    )
}

export default Login
