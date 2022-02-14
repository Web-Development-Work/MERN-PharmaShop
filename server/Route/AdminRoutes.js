const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const SendNotification = require('../HandleFunction/SendNotification')
const OTP = require('../models/OTP')
const path = require('path')
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const emailKey = 'irif34$ifhf$josdjfifh-$f4r23#'
const passKey = 'ifh04fkf@jfisf_w9efh4#snEFjd3fis3edowe-0#!'
const Admin = require('../models/Admin')

const nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'techfinderusa@gmail.com',
            pass: 'pgktvzarevqqmyiq',
        },
    }),
    EmailTemplate = require('email-templates').EmailTemplate,
    Promise = require('bluebird');

function sendEmail (obj) {
    return transporter.sendMail(obj);
}

function loadTemplate (templateName, contexts) {
    let template = new EmailTemplate(path.join(__dirname, '../templates', templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            });
        });
    }));
}

//OTP Middleware
function sendEmails(req, res, next) { 
    /**
     message    String
     emails [{
         emailAddress   String
         name   String
     }]
     */
    let {message} = req.body
    let emails = req.body.emails.map((email)=>{
        return {
            email:email.emailAddress,
            name:email.name,
            message
        }
    })
        loadTemplate('otp', emails).then((results) => {
            return Promise.all(results.map((result) => {
                console.log(result.email.html)
                sendEmail({
                    to: result.context.email,
                    from: 'Tech Finder <techfinderusa@gmail.com>',
                    subject: result.email.subject,
                    html: result.email.html,
                    text: result.email.text
        
                });
            }));
        }).then(() => {
            next()
        });   
}

//OTP Middleware
function sendAdminOtp(req, res, next) {
    const randomNumber = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    let request = req.body
    let message = 'Your verification code for password reset is: ' + randomNumber
        let users = [
            {
                email:request.email,
                name:request.name,
                message:message
            }
        ]
        loadTemplate('otp', users).then((results) => {
            return Promise.all(results.map((result) => {
                console.log(result.email.html)
                sendEmail({
                    to: "techfinderusa1@gmail.com",
                    from: 'Tech Finder <techfinderusa@gmail.com>',
                    subject: result.email.subject,
                    html: result.email.html,
                    text: result.email.text
        
                });
            }));
        }).then(() => {
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
        });   
}


app.post('/api/sendEmails',sendEmails,(req,res)=>{
    return res.json(handleSuccess('Emails sent'))
})

//Create Admin
app.post('/api/adminLogin',(req, res)=>{
    if(req.body.email && req.body.password){
        if(req.body.email.length>0 && req.body.password.length>0){
            let data = req.body
    var mykey = crypto.createCipher('aes-128-cbc', emailKey);
    var newEmail = mykey.update(data.email, 'utf8', 'hex')
    newEmail += mykey.final('hex');
    var myPasskey = crypto.createCipher('aes-128-cbc', passKey);
    var newPassword = myPasskey.update(data.password, 'utf8', 'hex')
    newPassword += myPasskey.final('hex');
    Admin.findOne({
        email:newEmail,
        password:newPassword
    },(err, doc)=>{
        if(err)return res.json(handleErr(err))
        else{
            if(doc!== null)
            return res.json(handleSuccess(doc))
            else{
                return res.json(handleErr('Unauthorized login'))
            }
        }
    })
        }
        else{
            return res.json(handleErr('Email and Password are required'))
        }
    }
    else return res.json(handleErr('Email and Password are null'))
})

//Create Admin
app.post('/api/createAdmin',(req,res)=>{
    if(req.body.email && req.body.password){
        let {email,password} = req.body
        if(email.length>0 && password.length>0){
            var mykey = crypto.createCipher('aes-128-cbc', emailKey);
            var newEmail = mykey.update(email, 'utf8', 'hex')
            newEmail += mykey.final('hex');
            var myPasskey = crypto.createCipher('aes-128-cbc', passKey);
            var newPassword = myPasskey.update(password, 'utf8', 'hex')
            newPassword += myPasskey.final('hex');
            let data = {
                email:newEmail,
                password:newPassword
            }
            Admin.create(data,(err,doc)=>{
                if(err)return res.json(handleErr(err))
                else{
                    return res.json(handleSuccess(doc))
                }
            })
        }else{
            return res.json(handleErr('Email and Password are required'))
        }
    }else{
        return res.json(handleErr('Admin can not be null'))
    }
})


//Change admin password
app.post('/api/updateAdminPassword',(req,res)=>{
    if(req.body.email && req.body.password && req.body.newPass){
        let {email,password} = req.body
        if(email.length>0 && password.length>0){
            var mykey = crypto.createCipher('aes-128-cbc', emailKey);
            var newEmail = mykey.update(email, 'utf8', 'hex')
            newEmail += mykey.final('hex');
            var myPasskey = crypto.createCipher('aes-128-cbc', passKey);
            var newPassword = myPasskey.update(password, 'utf8', 'hex')
            newPassword += myPasskey.final('hex');
            let data = {
                email:newEmail,
                password:newPassword
            }
            Admin.findOne(data,(err,doc)=>{
                if(err)return res.json(handleErr(err))
                else{
                    if(doc!==null){
                        //Change password
                        let {newPass} = req.body
                        var myPasskey = crypto.createCipher('aes-128-cbc', passKey);
                        var updatedPassword = myPasskey.update(newPass, 'utf8', 'hex')
                        updatedPassword += myPasskey.final('hex');
                        Admin.findOneAndUpdate({
                            email:newEmail
                        },{
                            password:updatedPassword
                        },{
                            new:true
                        },(error,admin)=>{
                            if(error)return res.json(handleErr(error))
                            else{
                                return res.json(handleSuccess(admin))
                            }
                        })

                    }
                    else{
                        return res.json(handleErr('Unauthorized access'))
                    }
                }
            })
        }else{
            return res.json(handleErr('Email and Password are required'))
        }
    }else{
        return res.json(handleErr('Admin can not be null'))
    }
})

app.post('/api/sendAdminPasswordOtp',sendAdminOtp, (req, res) => {
    return res.json(handleSuccess(req.result))
})
//Verify OTP
app.post('/api/verifyAdminOTP', (req, res) => {
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

//Set new password
app.post('/api/setAdminPassword',(req,res)=>{
    if(req.body.email && req.body.newPass){
        let {email,newPass} = req.body
        if(email.length>0 && newPass.length>0){
            var mykey = crypto.createCipher('aes-128-cbc', emailKey);
            var newEmail = mykey.update(email, 'utf8', 'hex')
            newEmail += mykey.final('hex');
            var myPasskey = crypto.createCipher('aes-128-cbc', passKey);
            var newPassword = myPasskey.update(newPass, 'utf8', 'hex')
            newPassword += myPasskey.final('hex');
            Admin.findOneAndUpdate({
                email:newEmail
            },{
                password:newPassword
            },{
                new:true
            },(error,admin)=>{
                if(error)return res.json(handleErr(error))
                else{
                    if(admin!==null){
                    return res.json(handleSuccess(admin))
                    }else{
                        return res.json(handleErr('Email not found'))
                    }
                }
            })
        }else{
            return res.json(handleErr('Email and Password are required'))
        }
    }else{
        return res.json(handleErr('Admin can not be null'))
    }
})


//Send notification
app.post('/api/sendAdminNotification',(req,res)=>{
    if(req.body.token && req.body.title && req.body.text){
        let {token,title,text} = req.body
        let data = {
            tokens: [token],
            body: text,
            title: title
        }
        SendNotification(data)
        return res.json(handleSuccess('Notification Sent'))
    }else{
        return res.json(handleErr('Notification data can not be null'))
    }
})


//Change admin password
app.post('/api/updateAdminPassword',(req,res)=>{
    if(req.body.email && req.body.password && req.body.newPass){
        let {email,password} = req.body
        if(email.length>0 && password.length>0){
            var mykey = crypto.createCipher('aes-128-cbc', emailKey);
            var newEmail = mykey.update(email, 'utf8', 'hex')
            newEmail += mykey.final('hex');
            var myPasskey = crypto.createCipher('aes-128-cbc', passKey);
            var newPassword = myPasskey.update(password, 'utf8', 'hex')
            newPassword += myPasskey.final('hex');
            let data = {
                email:newEmail,
                password:newPassword
            }
            Admin.findOne(data,(err,doc)=>{
                if(err)return res.json(handleErr(err))
                else{
                    if(doc!==null){
                        //Change password
                        let {newPass} = req.body
                        var myPasskey = crypto.createCipher('aes-128-cbc', passKey);
                        var updatedPassword = myPasskey.update(newPass, 'utf8', 'hex')
                        updatedPassword += myPasskey.final('hex');
                        Admin.findOneAndUpdate({
                            email:newEmail
                        },{
                            password:updatedPassword
                        },{
                            new:true
                        },(error,admin)=>{
                            if(error)return res.json(handleErr(error))
                            else{
                                return res.json(handleSuccess(admin))
                            }
                        })

                    }
                    else{
                        return res.json(handleErr('Unauthorized access'))
                    }
                }
            })
        }else{
            return res.json(handleErr('Email and Password are required'))
        }
    }else{
        return res.json(handleErr('Admin can not be null'))
    }
})
module.exports = app