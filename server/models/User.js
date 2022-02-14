const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text:{
        type:String
    },
    messageType:{           //0:text,1:File
        type:Number,
        default:0,
        min:0
    },
    createdDate:{
        type:Date,
        default:Date.now()
    },
    filePath:{          //If messageType is 1
        type:String
    },
    messageSender:{         //  Customer/Admin
        type:String,
        required:[true,'Message sender is required']
    },
    isRead:{
        type:Boolean,
        default:false
    }
})

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
    },
    name:{
        type:String,
        required:[true,'Address Name is required']
    }
})
const UserSchema = new mongoose.Schema({
  phone:{
      type:String,
      required:[true,'Phone number is required'],
      unique:true
  },
  fName:{
      type:String,
      required:[true,'Full name is required']
  },
  token:{       //FCM token
      type:String
  },
  blocked:{
      type:Boolean,
      default:false
  },
  isLoggedIn:{
      type:Boolean,
      default:false
  },
  balance:{
     type:Number,
     min:0,
     default:0
  },
  createdDate:{
    type:Date,
    default:Date.now()
  },
  city:{
    type:String,
  },
  addresses:[addressSchema],
  messages:[messageSchema],
  lastMessage:{
      type:Date
  },
  gender:{      //male/female
      type:String
  },
  email:{
    type:String,
    required:[true,'Email is required'],
    unique:true
},
});
UserSchema.index({name:'text','fName':"text"})
module.exports = mongoose.model('users', UserSchema);