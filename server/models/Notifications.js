const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
    createdDate: {
        type: Date,
        default: Date.now()
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    notificationType:{      //0: New Order 1: Order request
        type:Number,
        required:[true,'Notification type is required'],
        min:0
    },
    orderRequest:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderrequests"
    }
});
module.exports = mongoose.model('notifications', notificationSchema);