const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
    address:{
        type:String,
        required:[true,'Address is required']
    },
    longitude:{
        type:Number,
        required:[true,'Longitude is required']
    },
    latitude:{
        type:Number,
        required:[true,'Latitude is required']
    }
})
const orderRequestSchema = new mongoose.Schema({
  user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"users"
  },
  createdDate:{
    type:Date,
    default:Date.now()
  },
  city:{
    type:String,
  },
  deliveryAddress:addressSchema,
  images:[String],
  status:{      //0:Pending, 1:Preparing, 2: Partial, 3:Completed, 4:Rejected
      type:Number,
      default:0,
      max:4
  },
  notes:{
      type:String,
      required:[true,'Notes are required']
  },
  orderId:{
      type:String,
      required:true
  }
});
module.exports = mongoose.model('orderrequests', orderRequestSchema);