const Order = require('../models/Order')
const Products = require('../models/Products')
const Notifications = require('../models/Notifications')
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const SendNotification = require('../HandleFunction/SendNotification')
const jwt = require("jsonwebtoken");
const fs = require('fs')
const mime = require('mime')
const upload = require('../HandleFunction/UploadFile')
const User = require('../models/User')

//Create Order
app.post('/api/createOrder', (req, res) => {
    if (req.body.user && req.body.items && req.body.total !== undefined &&
        req.body.addressDetails !== undefined && req.body.zoneCharges) {
        let order = {
            user, items, total, addressDetails, zoneCharges
        } = req.body
        order.orderId = (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
        Order.create(order, (err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                order.items.forEach((product) => {
                    let { quantity, item } = product
                    Products.findByIdAndUpdate(item, { $inc: { stock: -quantity, sold: quantity } }, { new: true }, (errr, prod) => {
                        if (errr) return res.json(handleErr(errr))
                    })
                })
                Order.populate(doc, [{
                    path: "user",
                    model: "users"
                }, {
                    path: "items.item",
                    model: "products"
                }, {
                    path: "addressDetails.zone",
                    model: "zones"
                }], (error, ord) => {
                    if (error) return res.json(handleErr(error))
                    else {
                        let notification = {
                            order: doc._id,
                            user: doc.user,
                            notificationType: 0
                        }
                        Notifications.create(notification, (errr, not) => {
                            if (errr) return res.json(handleErr(errr))
                            else {
                                return res.json(handleSuccess(ord))
                            }
                        })
                    }
                })
            }
        })
    } else {
        return res.json(handleErr('Order details can not be null'))
    }
})

//get my orders
app.post('/api/getCurrentOrders', (req, res) => {
    if (req.body.user) {
        let { user } = req.body
        Order.find({ user, status: { $in: [0, 1, 2] } }).sort({ createdDate: -1 }).populate('items.item').populate('addressDetails.zone').populate('user').exec((err, docs) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(docs))
            }
        })
    } else {
        return res.json(handleErr('User can not be null'))
    }
})

//get my past orders
app.post('/api/getPastOrders', (req, res) => {
    if (req.body.user) {
        let { user } = req.body
        Order.find({ user, status: { $nin: [0, 1, 2] } }).sort({ createdDate: -1 }).populate('items.item').populate('addressDetails.zone').populate('user').exec((err, docs) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(docs))
            }
        })
    } else {
        return res.json(handleErr('User can not be null'))
    }
})

//Update order status
app.post('/api/updateOrderStatus', (req, res) => {
    if (req.body.id && req.body.status !== undefined) {
        let { id, status } = req.body
        Order.findByIdAndUpdate(id, { status }, { new: true }).populate('user').populate('addressDetails.zone').populate('items.item').exec((err, order) => {
            if (err) return res.json(handleErr(err))
            else {
                //Send notification here....
                let { user } = order
                if (user.token) {
                    let data = {
                        tokens: [user.token],
                        body: "Your order status is updated with Order ID:  " + order.orderId,
                        title: "Order status updated"
                    }
                    SendNotification(data)
                }
                return res.json(handleSuccess(order))
            }
        })
    } else {
        return res.json(handleErr('Order details can not be null'))
    }
})

//Get all pending orders
app.post('/api/allPendingOrders:page', (req, res) => {
    var page = req.params.page || 1;
    var perPage = 20;
    Order.find({ status: { $in: [0, 1, 2] } }).sort({ createdDate: -1 }).populate('user').populate('addressDetails.zone').populate('items.item').skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {
        Order.countDocuments({ status: { $in: [0, 1, 2] } }).exec((err, count) => {
            if (err) return res.json(handleErr(err))
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


//Get all past orders
app.post('/api/allPastOrders:page', (req, res) => {
    var page = req.params.page || 1;
    var perPage = 20;
    Order.find({ status: { $nin: [0, 1, 2] } }).sort({ createdDate: -1 }).populate('user').populate('addressDetails.zone').populate('items.item').skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {
        Order.countDocuments({ status: { $nin: [0, 1, 2] } }).exec((err, count) => {
            if (err) return res.json({ message: err })
            res.json({
                data,
                current: page,
                pages: Math.ceil(count / perPage),
                total: count
            })
        })
    })
})

//Update zoneCharges
app.put('/api/updateZoneCharges', (req, res) => {
    if (req.body.id && req.body.total !== undefined && req.body.zoneCharges !== undefined) {
        let { id, total, zoneCharges } = req.body
        Order.findByIdAndUpdate(id, { total, zoneCharges }, { new: true }).populate('user').populate('addressDetails.zone').populate('items.item').exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Order details can not be null'))
    }
})

//Search by OrderID
app.post('/api/searchOrderByID', (req, res) => {
    if (req.body.orderId) {
        let { orderId } = req.body
        Order.findOne({ orderId }).populate('user').populate('addressDetails.zone').populate('items.item').exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Order ID is required'))
    }
})

// app.get('/api/getlast15daysorderscountperday',(req,res)=>{
//     var date=new Date();
//     date.setDate(date.getDate()-30);
//     Order.aggregate
//     ([
//         {$match: {'createdDate': {$gt: date}}},
//         {$project:{createdDate:1,status:1,total:1}},
//         {$project:{year:{$year:"$createdDate"},month: { $month: "$createdDate" },day: { $dayOfMonth: "$createdDate"},status:1,total:1}},
//         {$group:{_id:{year:"$year",month:"$month",day:"$day"},orders:{$sum:1}}}

//     ])
//     .exec((err,docs)=>{
//         if(err){
//             return res.json({message:"Failed",err})
//         }
//         else{
//             return res.json({message:"Success",docs})
//         }
//     })
// })

app.get('/api/getlast30daysearningcountperday', (req, res) => {
    var date = new Date();
    date.setDate(date.getDate() - 15);

    Order.aggregate
        ([
            { $match: { 'createdDate': { $gt: date } } },
            { $match: { 'status': { $in: [2, 3] } } },
            { $project: { createdDate: 1, status: 1, total: 1 } },
            { $project: { year: { $year: "$createdDate" }, month: { $month: "$createdDate" }, day: { $dayOfMonth: "$createdDate" }, status: 1, total: 1 } },
            { $group: { _id: { year: "$year", month: "$month", day: "$day" }, total: { $sum: "$total" } } }

        ])
        .exec((err, docs) => {
            if (err) {
                return res.json({ message: "Failed", err })
            }
            else {
                let i;
                let datee = []
                let values = []
                let dates = docs.map(b => {
                    let stringg = b._id.day + '/' + b._id.month
                    return stringg
                })
                let valuesArr = docs.map((b) => b.total)
                // let counter = 0
                for (i = 1; i <= 15; i++) {

                    var date = new Date();
                    date.setDate(date.getDate() - i);
                    date.setMonth(date.getMonth() + 1)
                    let dateString = date.getDate() + "/" + date.getMonth()
                    if (dates.indexOf(dateString) > -1) {
                        // datee.push(dateString
                        // let datestr = ""+docs[counter]._id.day+"/"+docs[counter]._id.month
                        // let orderVal = docs[counter].total
                        let orderVal = valuesArr[dates.indexOf(dateString)]
                        datee[i] = dateString

                        // counter++
                        values[i] = orderVal
                    }
                    else {
                        // datee.push(dateString)
                        // values.push(0)
                        values[i] = 0
                        datee[i] = dateString
                    }
                }
                //})
                // console.log(date)
                setTimeout(() => {
                    return res.json({ message: "dates", datee, values })
                }, 3000);

            }
        })
})




app.get('/api/getlast30daysorderscountperday', (req, res) => {
    var date = new Date();
    date.setDate(date.getDate() - 15);
    Order.aggregate
        ([
            { $match: { 'createdDate': { $gt: date } } },
            { $project: { createdDate: 1, status: 1, total: 1 } },
            { $project: { year: { $year: "$createdDate" }, month: { $month: "$createdDate" }, day: { $dayOfMonth: "$createdDate" }, status: 1, total: 1 } },
            { $group: { _id: { year: "$year", month: "$month", day: "$day" }, orders: { $sum: 1 } } }

        ])
        .exec((err, docs) => {
            if (err) {
                return res.json({ message: "Failed", err })
            }
            else {
                let i;
                let datee = []
                let values = []
                let dates = docs.map(b => {
                    let stringg = b._id.day + '/' + b._id.month
                    return stringg
                })
                let valuesArr = docs.map((b) => b.orders)
                // let counter = 0
                for (i = 1; i <= 15; i++) {

                    var date = new Date();
                    date.setDate(date.getDate() - i);
                    date.setMonth(date.getMonth() + 1)
                    let dateString = date.getDate() + "/" + date.getMonth()
                    if (dates.indexOf(dateString) > -1) {
                        // datee.push(dateString
                        // let datestr = ""+docs[counter]._id.day+"/"+docs[counter]._id.month
                        let orderVal = valuesArr[dates.indexOf(dateString)]
                        // console.log('val---->',orderVal)
                        datee[i] = dateString

                        // counter++
                        values[i] = orderVal
                    }
                    else {
                        // datee.push(dateString)
                        // values.push(0)
                        values[i] = 0
                        datee[i] = dateString
                    }
                }
                setTimeout(() => {
                    return res.json({ message: "dates", datee, values })
                }, 3000);

            }
        })
})

app.get('/api/adminanalytics', (req, res) => {
    User.countDocuments().exec((err, totalusers) => {
        if (err) {
            return res.json({ messaage: "Failed", err })
        }
        else {
            Order.countDocuments().exec((err, totalorders) => {
                if (err) {
                    return res.json({ messaage: "Failed", err })
                }
                else {

                    Products.countDocuments().exec((err, totalproducts) => {
                        if (err) {
                            return res.json({ messaage: "Failed", err })
                        }
                        else {
                            var date = new Date();
                            date.setDate(date.getDate() - 30);

                            Order.aggregate
                                ([
                                    { $match: { 'createdDate': { $gt: date } } },
                                    { $match: { status: { $in: [2, 3] } } },
                                    { $project: { createdDate: 1, status: 1, total: 1 } },
                                    { $project: { year: { $year: "$createdDate" }, month: { $month: "$createdDate" }, day: { $dayOfMonth: "$createdDate" }, status: 1, total: 1 } },
                                    { $group: { _id: null, total: { $sum: "$total" } } }
                                ])
                                .exec((err, docs) => {
                                    if (err) {
                                        return res.json({ message: "Failed", err })
                                    }
                                    else {
                                        if (docs.length > 0) {
                                            return res.json({ messaage: "Success", totalusers, totalorders, totalproducts, earning: docs[0].total })
                                        }
                                        else {
                                            return res.json({ messaage: "Success", totalusers, totalorders, totalproducts, earning: 0 })
                                        }
                                    }
                                })


                        }
                    })
                }
            })
        }
    })
})

module.exports = app

//total users k liat user.count documents
//total orders k liay b order.count document
//total products k liay b product.count document
//last 30 days orders ka total