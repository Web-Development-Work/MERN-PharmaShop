const User = require('../models/User')
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const SendNotification = require('../HandleFunction/SendNotification')
const uid = require('uid')
const OTP = require('../models/OTP')

const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);

function sendOtp(req, res, next) {
    const randomNumber = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    let request = req.body
    let message = 'Your verification code is: ' + randomNumber
    bcrypt.hash(randomNumber.toString(), salt, (err, hashed) => {
        if (err) {
            return res.json(handleErr(err))
        }
        else {
            let date = new Date(Date.now())
            date.setHours(date.getHours() + 6)
            let data = {
                validTill: date
            }
            data.code = hashed
            OTP.create(data, (error, doc) => {
                if (error) return res.json(handleErr(error))
                else {
                    let response = {
                        salt,
                        number: randomNumber,
                        doc
                    }
                    req.result = response
                    next()
                }
            })
        }
    })
}

app.post('/api/emailLogin', (req, res) => {
    if (req.body.email) {
        const { email } = req.body
        User.findOneAndUpdate({
            email
        }, { isLoggedIn: true }, { new: true }).exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                if (doc !== null) {
                    return res.json(handleSuccess(doc))
                } else {
                    return res.json(handleSuccess('No user found'))
                }
            }
        })
    } else {
        return res.json(handleErr('Email can not be null'))
    }
})

app.post('/api/sendOtp', sendOtp, (req, res) => {
    return res.json(handleSuccess(req.result))
})
//Verify OTP
app.post('/api/verifyOTP', (req, res) => {
    /**
     id (OTP ObjectID)
     number (Number)
     */
    if (req.body.id) {
        let data = req.body
        OTP.findById(req.body.id, (err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                bcrypt.compare(data.number.toString(), doc.code, (error, result) => {
                    console.log(result)
                    if (result === false) return res.json(handleErr('Invalid OTP'))
                    else {
                        return res.json(handleSuccess(result))
                    }
                })
            }
        })
    }
})

//Create User
app.post('/api/addUser', (req, res) => {            //tested
    const user = req.body
    if (user.phone) {
        User.create(user, (err, doc) => {
            if (err) {
                return res.json(handleErr(err))
            }
            else {
                return res.json(handleSuccess(doc))
            }
        })
    }
    else {
        return res.json(handleErr('User can not be null'))
    }
})

//Get userData
app.post('/api/getUserData', (req, res) => {
    if (req.body.id) {
        let { id } = req.body
        User.findById(id).exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('User can not be null'))
    }
})

//Block User
app.put('/api/blockUser', (req, res) => {
    if (req.body.id) {
        let { id } = req.body
        User.findByIdAndUpdate(id, { blocked: true }, { new: true }).exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                if (doc.token) {
                    let data = {
                        tokens: [doc.token],
                        body: "Your ID has been blocked by admin!",
                        title: "Blocked!"
                    }
                    SendNotification(data)
                }
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('User can not be null'))
    }
})

//Unblock User
app.put('/api/unblockUser', (req, res) => {
    if (req.body.id) {
        let { id } = req.body
        User.findByIdAndUpdate(id, { blocked: false }, { new: true }).exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                if (doc.token) {
                    let data = {
                        tokens: [doc.token],
                        body: "Your ID has been unblocked by admin. Welcome BACK!",
                        title: "Unblocked!"
                    }
                    SendNotification(data)
                }
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('User can not be null'))
    }
})

//Add Address
app.post('/api/addAddress', (req, res) => {
    if (req.body.id && req.body.name && req.body.address && req.body.longitude !== undefined && req.body.latitude !== undefined) {
        let { id, name, address, longitude, latitude } = req.body
        let addressDetails = {
            name, address, longitude, latitude
        }
        User.findByIdAndUpdate(id, { $push: { addresses: addressDetails } }, { new: true }, (err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Address details can not be null'))
    }
})

//Get users
app.post('/api/users:page', (req, res) => {
    var perPage = 20
    var page = req.params.page || 1
    User.find({}).skip((perPage * page) - perPage).limit(perPage).exec((error, data) => {
        if (error) return res.json(handleErr(error))
        else User.estimatedDocumentCount({}).exec((err, count) => {
            if (err) return res.json(handleErr(err))
            else {
                let response = {
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    total: count
                }
                return res.json(handleSuccess(response))
            }
        })
    })
})

//Search Users
app.post('/api/searchUsers', (req, res) => {
    if (req.body.name) {
        User.find({ fName: { $regex: req.body.name + '.*' } })
            .limit(20)
            .exec((err, docs) => {
                if (err)
                    return res.json(handleErr(err))
                else { res.json(handleSuccess(docs)) }
            });
    } else {
        return res.json(handleErr('User name is required'))
    }
})

app.get('/api/getlast30daysusersregistercountperday', (req, res) => {
    var date = new Date();
    date.setDate(date.getDate() - 10);

    User.aggregate
        ([
            { $match: { 'createdDate': { $gt: date } } },
            { $project: { createdDate: 1, status: 1, total: 1 } },
            { $project: { year: { $year: "$createdDate" }, month: { $month: "$createdDate" }, day: { $dayOfMonth: "$createdDate" }, status: 1, total: 1 } },
            { $group: { _id: { year: "$year", month: "$month", day: "$day" }, users: { $sum: 1 } } }

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
                let counter = 0
                for (i = 1; i <= 11; i++) {

                    var date = new Date();
                    date.setDate(date.getDate() - i);
                    date.setMonth(date.getMonth() + 1)
                    let dateString = date.getDate() + "/" + date.getMonth()
                    if (dates.indexOf(dateString) > -1) {
                        // datee.push(dateString
                        let datestr = "" + docs[counter]._id.day + "/" + docs[counter]._id.month
                        let orderVal = docs[counter].users
                        datee[i] = datestr

                        counter++
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
                }, 2000);

            }
        })
})

//Chat users
app.post('/api/chatUsers:page', (req, res) => {
    var perPage = 20
    var page = req.params.page || 1
    User.find({}).sort({ lastMessage: -1 }).skip((perPage * page) - perPage).limit(perPage).exec((error, data) => {
        if (error) return res.json(handleErr(error))
        else User.estimatedDocumentCount({}).exec((err, count) => {
            if (err) return res.json(handleErr(err))
            else {
                let response = {
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    total: count
                }
                return res.json(handleSuccess(response))
            }
        })
    })
})

//Update user
app.put('/api/updateUser', (req, res) => {
    if (req.body.id) {
        let data = req.body
        let { id } = req.body
        User.findByIdAndUpdate(id, data, { new: true }, (err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('User can not be null'))
    }
})

//Logout user
app.put('/api/logoutUser', (req, res) => {
    if (req.body.id) {
        let { id } = req.body
        User.findByIdAndUpdate(id, { $unset: { token: null }, isLoggedIn: false }, { new: true }, (err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('User can not be null'))
    }
})
module.exports = app;