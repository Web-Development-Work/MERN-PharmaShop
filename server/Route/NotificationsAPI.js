const Notifications = require('../models/Notifications')
const OrderRequest = require('../models/OrderRequest')
const Order = require('../models/Order')
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')

//Get latest notifications
app.post('/api/latestNotifications',(req,res)=>{
    Notifications.find({}).sort({createdDate:-1}).limit(20)
    .populate('user','fName email city')
    .populate('order','orderId total')
    .populate('orderRequest','orderId city')
    .exec((err,docs)=>{
        if(err)return res.json(handleErr(err))
        else{
            return res.json(handleSuccess(docs))
        }
    })
})

//Get all Notifications
app.post('/api/getNotifications:page', (req, res) => {
    var page = req.params.page || 1;
    var perPage = 20;
    Notifications.find({})
    .populate('user','fName email city')
    .populate('order','orderId total')
    .populate('orderRequest','orderId city')
    .skip((perPage * page) - perPage).sort({createdDate:-1}).limit(perPage).exec((err, data) => {
        if (err) return res.json(handleErr(err))
        else Notifications.countDocuments().exec((error, count) => {
            if (error) return res.json(handleErr(error))
            else {
                return res.json(handleSuccess({
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    total: count
                }))
            }
        })
    })
})

// Bulk notifications
// app.post('/api/bulkNotifications',(req,res)=>{
//     Order.find({},'user',(err,orders)=>{
//         if(err)return res.json(handleErr(err))
//         else{
//             OrderRequest.find({},'user',(err,orderrequests)=>{
//                 if(err)return res.json(handleErr(err))
//                 else{
//                     orders.forEach(order => {
//                         let notification={
//                             order:order._id,
//                             user:order.user,
//                             notificationType:0
//                         }
//                         Notifications.create(notification,(errr,not)=>{
//                             if(errr)return res.json(handleErr(errr))
//                             else{
//                             }
//                         })
//                     });

//                     orderrequests.forEach(orderReq => {
//                         let notification={
//                             orderRequest:orderReq._id,
//                             user:orderReq.user,
//                             notificationType:1
//                         }
//                         Notifications.create(notification,(errr,not)=>{
//                             if(errr)return res.json(handleErr(errr))
//                             else{
//                             }
//                         })
//                     });
//                 }
//             })
//         }
//     })
//     setTimeout(()=>{
//         return res.json(handleSuccess('DONE'))
//     },5000)
// })

module.exports = app