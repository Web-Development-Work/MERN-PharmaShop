const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address:{
        type:String
    },
    location:{
        type:[Number]           //[longitude,latitude]
    },
    zone:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"zones"
    },
    instructions:{
        type:String
    }
})

const itemSchema = new mongoose.Schema({
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products"
    },
    quantity:{
        type:Number,
        min:1,
        required:[true,'Item quantity is required']
    },
    unitPrice:{
        type:Number,
        min:0
    }
})

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    items:[itemSchema],
    total:{
        type:Number,
        min:0,
        required:[true,'Item quantity is required']
    },
    status:{            //0:pending, 1: preparing, 2:delivered, 3:completed, 4:cancelled
        type:Number,
        default:0,
        min:0
    },
    createdDate:{
        type:Date,
        default:Date.now()
    },
    addressDetails:{
        type:addressSchema
    },
    orderId:{
        type:Number,
        min:0
    },
    zoneCharges:{
        type:Number,
        min:0
    },
    deliveryDate:{
        type:Date
    }

});
 
   module.exports = mongoose.model('orders', orderSchema);