import { useState, useEffect } from 'react';
import { Drawer } from 'antd';
import SocketIOClient from "socket.io-client";
import { url, header } from '../Constant/Constant'

import '../Style/Chat.css'
import user1 from '../assets/img/faces/face-1.jpg'

const socket = SocketIOClient(url, {
    path: '/socket.io',
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    timeout: 20000,
    autoConnect: true,
    query: {},
    // options of the Engine.IO client
    upgrade: true,
    forceJSONP: false,
    jsonp: true,
    forceBase64: false,
    enablesXDR: false,
    timestampRequests: true,
    timestampParam: 't',
    policyPort: 843,
    transports: ['polling', 'websocket'],
    transportOptions: {},
    rememberUpgrade: false,
    onlyBinaryUpgrades: false,
    requestTimeout: 0,
    protocols: [],
    // options for Node.js
    agent: false,
    pfx: null,
    key: null,
    passphrase: null,
    cert: null,
    ca: null,
    ciphers: [],
    rejectUnauthorized: true,
    perMessageDeflate: true,
    forceNode: false,
    localAddress: null,

});

socket.connect();

const Chat = () => {
    const [isVisible, setisVisible] = useState(false)
    const [ChildDrawer, setChildDrawer] = useState(false)
    const [SearchName, setSearchName] = useState('')
    const [Userdata, setUserdata] = useState('')
    const [UserMessages, setUserMessages] = useState('')
    const [MessageSend, setMessageSend] = useState('')
    const [UserId, setUserId] = useState('')
    // const [uploadFile, setuploadFile] = useState(null)

    useEffect(() => {
        fetch(`${url}/api/chatUsers1`, {
            method: 'POST',
            headers:header
        })
            .then(res => res.json())
            .then(data => {
                let a = data.doc.data[0].messages.length - 1
                setUserdata(data.doc.data)
                // console.log(data.doc.data)
                // console.log(data.doc.data[0].messages[a].text)
            })
    }, [])

    const OnChangehandler = e => {
        const data = new FormData();
        data.append('fileData', e.target.files[0])
        fetch(`${url}/api/uploadFile`, {
            method: "POST",
            body: data,
            header: header
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.doc.filePath)
                let obj = {
                    messageSender: 'Admin',
                    filePath: data.doc.filePath,
                    id: UserId,
                    messageType: 1
                }
                console.log('obj ==> ', obj)
                socket.emit('sendMessage', {
                    messageSender: 'Admin',
                    filePath: data.doc.filePath,
                    id: UserId,
                    messageType: 1
                })
            })

    }

    const OnMessageSend = () => {
        if (MessageSend === '') {

        } else {
            socket.emit('sendMessage', {
                messageSender: 'Admin',
                text: MessageSend,
                id: UserId,
                messageType: 0
            })
            setMessageSend('')
        }
    }

    socket.on('messageSent', (message) => {
        console.log(message)
        setUserMessages(message.data.messages)

    })

    const showDrawer = () => {
        setisVisible(true)
    };

    const onClose = () => {
        setisVisible(false)
    };

    const showChildrenDrawer = (messages, UserId) => {
        setChildDrawer(true)
        console.log(messages)
        setUserId(UserId)
        setUserMessages(messages)
    };

    const onChildrenDrawerClose = () => {
        setChildDrawer(false)
    };

    const OnSearch = () => {
        fetch(`${url}/api/searchUsers`, {
          method: 'POST',
          body: JSON.stringify({
            name: SearchName
          }),
          headers: header
        })
          .then(res => res.json())
          .then(data => {
            // console.log(data)
            if (data.message === 'Success') {
              setUserdata(data.doc)
            }
          }
          )
      }

    return (
        <>
            <i className="nc-icon nc-chat-round chat-btn" onClick={showDrawer} />
            <Drawer width={300} closable={false} onClose={onClose} visible={isVisible}>
                <div className='U-search '>
                    <input value={SearchName} onChange={e => setSearchName(e.target.value)} placeholder='Search User...' className='U-input' />
                    <i onClick={OnSearch} className="nc-icon nc-zoom-split search-icon-chat"></i>
                
                </div>
                <div className='Chat-container'>
                    {
                        Userdata ? Userdata && Userdata.map(user => (

                            <li>
                                <div className='Chat-div' onClick={() => showChildrenDrawer(user.messages, user._id)}>
                                    <img src={user1} className='chat-user-img' alt='user' />
                                    <div>
                                        <h4 className='chat-user-name'> {user.fName} </h4>
                                        <p className='chat-lastchat'> {user.messages.length === 0 ? 'last message' : user.messages[user.messages.length - 1].text === String ? user.messages[user.messages.length - 1].text.toLowerCase().length >= 20 ? `${user.messages[user.messages.length - 1].text.toLowerCase().slice(0, 20)}...` : 'Image' : user.messages[user.messages.length - 1].text === String ? user.messages[user.messages.length - 1].text.toLowerCase() : 'Images' } </p>
                                    </div>
                                </div>
                            </li>
                        )) : <></>
                    }
                </div>


                <Drawer className="chat-drawer" title='User' width={480} closable={false} onClose={onChildrenDrawerClose} visible={ChildDrawer} >

                    <div className='Chat-container2'>
                        {
                            UserMessages ? UserMessages && UserMessages.map(msg => (
                                <>
                                    {msg.messageSender === 'Customer' ? (
                                        msg.messageType === 0 ? (
                                            <div className='chat-receive'>
                                                <p>
                                                    {msg.text}
                                                </p>
                                            </div>
                                        ) : (
                                                msg.filePath !== undefined ? (
                                                    <div className='chat-receive'>
                                                        <img className='chat-img' src={`${url}/api/getFile${msg.filePath}`} />
                                                    </div>
                                                ) : <></>

                                            )

                                    ) : (
                                            msg.messageType === 0 ? (
                                                <div className='chat-send'>
                                                    <p>
                                                        {msg.text}
                                                    </p>
                                                </div>
                                            ) : (
                                                    msg.filePath !== undefined ? (
                                                        <div className='chat-send'>
                                                            <img className='chat-img' src={`${url}/api/getFile${msg.filePath}`} />
                                                        </div>
                                                    ) : <></>

                                                )

                                        )}


                                </>
                            )) : <></>
                        }

                    </div>
                    <div className='U-search chat-lower-div '>
                        <div className='file-div'>
                            <input type='file' className='inputhide' onChange={OnChangehandler} />
                            <i class="fas fa-paperclip chat-paperclip"></i>
                        </div>
                        <input value={MessageSend} onChange={e => setMessageSend(e.target.value)} placeholder='Send Message...' className='U-input Chat-search' />
                        <i onClick={OnMessageSend} class="fas fa-paper-plane chat-send-icon"></i>

                    </div>
                </Drawer>
            </Drawer>
        </>
    );
}


export default Chat