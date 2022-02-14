const OrderRequest = require('../models/OrderRequest')
const Notifications = require('../models/Notifications')
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const uploadMult = require('../HandleFunction/UploadMulti')
const webp = require('webp-converter');
webp.grant_permission();
//Add order request
app.post('/api/addOrderRequest', (req, res) => {
    uploadMult(req, res, function (err) {
        if (err) {
            return res.json(handleErr(err))
        }
        else {
            if (req.files !== undefined && req.body.user !== undefined &&
                req.body.longitude !== undefined && req.body.latitude !== undefined && req.body.address !== undefined) {
                let fileData = req.files
                if (fileData.length > 0 && fileData.length < 15) {
                    let addAditionalImages = fileData.map((file) => {
                        var sourceFile = __dirname + '/../pharmashopfiles/' + file.filename;
                        var resultFile = __dirname + '/../pharmashopfiles/' + file.filename + '.webp';
                        const result = webp.cwebp(sourceFile, resultFile, "-q 80", logging = "-v");
                        result.then((resp) => {
                            console.log(resp);
                            return resultFile
                        });
                    })
                    let data = {
                        images: addAditionalImages,
                        deliveryAddress: {
                            address: req.body.address,
                            longitude: req.body.longitude,
                            latitude: req.body.latitude
                        },
                        notes: req.body.notes,
                        user: req.body.user,
                        orderId: (Math.floor(Math.random() * 100000) + 100000).toString().substring(1)
                    }
                    OrderRequest.create(data, (err, doc) => {
                        if (err) return res.json(handleErr(err))
                        else {
                            OrderRequest.populate(doc, [{
                                path: "user",
                                model: "users"
                            }], (errr, order) => {
                                if (errr) return res.json(handleErr(errr))
                                else {
                                    let notification = {
                                        orderRequest: doc._id,
                                        user: doc.user,
                                        notificationType: 1
                                    }
                                    Notifications.create(notification, (errr, not) => {
                                        if (errr) return res.json(handleErr(errr))
                                        else {
                                            return res.json(handleSuccess(order))
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    return res.json(handleErr('Up to 15 images are required'))
                }
            }
            else {
                return res.json(handleErr('Order request data can not be null'))
            }
        }
    });
});

//Create order request
app.post('/api/createNewOrderRequest', (req, res) => {
    if (req.body.images !== undefined && req.body.user !== undefined &&
        req.body.longitude !== undefined && req.body.latitude !== undefined && req.body.address !== undefined) {
        let fileData = req.body.images
        if (fileData.length > 0 && fileData.length < 15) {
            let data = {
                images: fileData,
                deliveryAddress: {
                    address: req.body.address,
                    longitude: req.body.longitude,
                    latitude: req.body.latitude
                },
                notes: req.body.notes,
                user: req.body.user,
                orderId: (Math.floor(Math.random() * 100000) + 100000).toString().substring(1)
            }
            OrderRequest.create(data, (err, doc) => {
                if (err) return res.json(handleErr(err))
                else {
                    OrderRequest.populate(doc, [{
                        path: "user",
                        model: "users"
                    }], (errr, order) => {
                        if (errr) return res.json(handleErr(errr))
                        else {
                            return res.json(handleSuccess(order))
                        }
                    })
                }
            })
        }
        else {
            return res.json(handleErr('Up to 15 images are required'))
        }
    }
    else {
        return res.json(handleErr('Order request data can not be null'))
    }
});

//Upload multiple files
app.post('/api/uploadMultipleFiles', (req, res) => {
    uploadMult(req, res, function (err) {
        if (err) {
            return res.json(handleErr(err))
        }
        else {
            if (req.files !== undefined) {
                let fileData = req.files
                if (fileData.length > 0 && fileData.length < 15) {
                    let addAditionalImages = fileData.map((file) => {
                        var sourceFile = __dirname + '/../pharmashopfiles/' + file.filename;
                        var resultFile = __dirname + '/../pharmashopfiles/' + file.filename + '.webp';
                        const result = webp.cwebp(sourceFile, resultFile, "-q 80", logging = "-v");
                        result.then((resp) => {
                            console.log(resp);
                            return resultFile
                        });
                    })
                    return res.json(handleSuccess(addAditionalImages))
                }
                else {
                    return res.json(handleErr('Up to 15 images are required'))
                }
            }
            else {
                return res.json(handleErr('Order request data can not be null'))
            }
        }
    });
});

//Get all order requests of user
app.post('/api/getUserOrderRequests', (req, res) => {
    if (req.body.user) {
        let { user } = req.body
        OrderRequest.find({ user, status: { $nin: [2, 3] } }).sort({ createdDate: -1 }).populate('user').exec((err, docs) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(docs))
            }
        })

    } else {
        return res.json(handleErr('User cna not be null'))
    }
})

//reject order request
app.put('/api/rejectOrderRequest', (req, res) => {
    if (req.body.id) {
        let { id } = req.body
        OrderRequest.findByIdAndUpdate(id, { $set: { status: 4 } }, { new: true }).populate('user').exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Order request can not be null'))
    }
})

//

//Get order requests
app.post('/api/orderRequests:page', (req, res) => {
    var perPage = 20
    var page = req.params.page || 1
    OrderRequest.find({}).sort({ createdDate: -1 }).populate('user').skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {
        OrderRequest.estimatedDocumentCount().exec((err, count) => {
            if (err) return res.json(handleErr(err))
            return res.json(handleSuccess({
                data,
                current: page,
                pages: Math.ceil(count / perPage),
                total: count
            }))
        })
    })
})

//Delete all requests
app.get('/api/deleteAllRequestsssss', (req, res) => {
    OrderRequest.deleteMany({}, (err, docs) => {
        if (err) return res.json(handleErr(err))
        else {
            return res.json(handleSuccess(docs))
        }
    })
})

//Order Request by id
app.post('/api/orderRequestByOrderID', (req, res) => {
    if (req.body.orderId) {
        let { orderId } = req.body
        OrderRequest.findOne({ orderId }).populate('user').exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Order ID is required'))
    }
})
module.exports = app