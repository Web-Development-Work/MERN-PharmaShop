const express = require('express')
var http = require('http')
const app = express()
var server = http.createServer(app);
const process = require('process')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
// const uid = require('uid')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const mime = require('mime')

const url = 'mongodb://localhost:27017/pharmaapp';
const port = process.env.PORT || 5600
const cors = require('cors')
const cron = require('node-cron')
const client = require('socket.io')(server).sockets;
const fs = require('fs');


// Middleware
app.use(cors())
app.use(bodyParser.json())  //Body Parser MiddleWare
app.use(express.json())
app.use(express.static('uploads'))

const rateLimit = require("express-rate-limit");
const webp = require('webp-converter')
const upload = require('./HandleFunction/UploadFile')


// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 200 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

const nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'patidaranil0791@gmail.com',
            pass: 'driptydtlzkacu',
        },
    }),
    EmailTemplate = require('email-templates').EmailTemplate,
    Promise = require('bluebird');

function sendEmail(obj) {
    return transporter.sendMail(obj);
}



function loadTemplate(templateName, contexts) {
    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
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
function sendOtp(req, res, next) {
    const randomNumber = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    let request = req.body
    let message = 'Your verification code is: ' + randomNumber
    let users = [
        {
            email: request.email,
            name: request.name,
            message: message
        }
    ]
    loadTemplate('otp', users).then((results) => {
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
        console.log('Done=>', message)
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


// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.setHeader('Acces-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
//     res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');
//     next();
// });


//APIs
app.use('', require('./Route/UserApi'))
app.use('', require('./Route/BrandAPI'))
app.use('', require('./Route/CategoryAPI'))
app.use('', require('./Route/ProductsAPI'))
app.use('', require('./Route/ZonesAPI'))
app.use('', require('./Route/OrdersAPI'))
app.use('', require('./Route/AdminRoutes'))
app.use('', require('./Route/FAQsAPI'))
app.use('', require('./Route/OrderRequestAPI'))
app.use('', require('./Route/OfferAPI'))
app.use('', require('./Route/NotificationsAPI'))
webp.grant_permission();







//MongoDB connection
mongoose.connect(url, { useNewUrlParser: true }) //MongoDB connection using Mongoose
var db = mongoose.connection //Mongo Connection Instance

db.on('open', () => {
    console.log('database connected')
})

app.get('/', function (req, res) {  //HomePage for API
    res.json({status:200, message: 'Welcome to My Tech World' })
})



client.on('connection', (socket) => {
    console.log('Client connected')
    client.emit('connecteddd', {
        message: "hello"
    })

    socket.on('sendMessage', (data) => {
        /**
         id   Order ID
         message:{
             messageSender String (Customer/Admin)
             text String (if messageType is 1)
             filePath String (if messageType is 1)
             messageType Number
         }
         */
        let { id, text, messageType, messageSender } = data
        if (messageType !== undefined && id !== undefined && messageSender !== undefined) {
            if (messageType === 0) {
                let message = {
                    text,
                    messageSender,
                    messageType
                }
                User.findByIdAndUpdate(id, { lastMessage: new Date(Date.now()), $push: { messages: message } }, { new: true }).exec((err, doc) => {
                    if (err) {
                        client.emit('messageSent', {
                            message: "Failed",
                            data: err
                        })
                    } else {
                        if (message.messageSender === 'Customer') {
                            //Send notification to Mechanic
                            // let { mechanic } = doc
                            // let { token } = mechanic
                            // if (token !== undefined && token !== null) {
                            //     let data = {
                            //         tokens: [token],
                            //         body: message.messageType === 0 ? message.text : "File",
                            //         title: "New message"
                            //     }
                            //     sendNotification(data)
                            // }
                        }
                        client.emit('messageSent', {
                            message: "Success",
                            data: doc
                        })
                    }
                })
            }
            else if (messageType === 1) {
                let { filePath } = data
                let message = {
                    filePath,
                    messageSender,
                    messageType
                }
                User.findByIdAndUpdate(id, { lastMessage: new Date(Date.now()), $push: { messages: message } }, { new: true }).exec((err, doc) => {
                    if (err) {
                        client.emit('messageSent', {
                            message: "Failed",
                            data: err
                        })
                    } else {
                        if (message.messageSender === 'Customer') {
                            //Send notification to Mechanic
                            // let { mechanic } = doc
                            // let { token } = mechanic
                            // if (token !== undefined && token !== null) {
                            //     let data = {
                            //         tokens: [token],
                            //         body: message.messageType === 0 ? message.text : "File",
                            //         title: "New message"
                            //     }
                            //     sendNotification(data)
                            // }
                        }
                        client.emit('messageSent', {
                            message: "Success",
                            data: doc
                        })
                    }
                })
            }

        }
        else {
            client.emit('messageSent', {
                message: "Failed",
                data: "User and nessage sender can not be null"
            })
        }
    })

})


//Upload Audio/Image/File for message
app.post('/api/uploadFile', upload.single('fileData'), (req, res) => {    
    //tested
    //below code will read the data from the upload folder. Multer will automatically upload the file in that folder with an  autogenerated name
    fs.readFile(req.file.path, (err, contents) => {
        if (err) {
            return res.json(handleErr(err))
        } else {
            var file = __dirname + '/../pharmashopfiles/' + req.file.filename;
            var resultFile = __dirname + '/../pharmashopfiles/' + req.file.filename + '.webp';
            const result = webp.cwebp(file, resultFile, "-q 80", logging = "-v");
            result.then((resp) => {
                console.log(resp);
                let response = {
                    filePath: resultFile
                }
                return res.json(handleSuccess(response))
            });
        }
    });
})


//Get File
app.get('/api/getFile:path', (req, res) => {
    try {
        var file = __dirname + '/../pharmashopfiles/' + req.params.path;

        var filename = path.basename(file);
        var mimetype = mime.getType(file);
        console.log('file->', file)
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
    } catch (error) {
        return res.json(handleErr(error))
    }
})


//Delete a file
app.delete('/api/deleteFile', async (req, res) => {
    if (req.body.filename) {
        let { filename } = req.body
        try {
            deleteFile(filename)
            return res.json(handleSuccess('Done'))
        } catch (error) {
            return res.json(handleErr(error))
        }
    } else {
        return res.json(handleErr('File can not be null'))
    }
})



app.post('/api/sendEmailOtp', sendOtp, (req, res) => {
    return res.json(handleSuccess(req.result))
})



app.post('/api/verifyEmailOTP', (req, res) => {
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



// app.get('/api/allWebp', (req, res) => {
//     fs.readdir(__dirname + '/pharmashopfiles/', (err, files) => {
//         if (err) return res.json(handleErr(err))
//         else {
//             console.log('files--->', files)
//             files.forEach((file) => {
//                 const result = webp.cwebp(__dirname + '/pharmashopfiles/'+file, file+".webp", "-q 80", logging = "-v");
//                 result.then((response) => {
//                     console.log(response);
//                 });
//             })
//             setTimeout(()=>{
//                 return res.json(handleSuccess('done'))
//             },30*1000)
//         }
//     })
// })








//Server
server.listen(port, () => {
    console.log('Server started on port: ', port)
})