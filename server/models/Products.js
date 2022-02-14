const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
     title:{
         type:String,
         required:[true,"Brand name can not be null"]
     },
     images:[String],
     createdDate:{
         type:Date,
         default:Date.now()
     },
     enabled:{
         type:Boolean,
         default:true
     },
     category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories"
     },
     subcategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories.subcategories"
    },
    description:{
        type:String,
        required:[true,'Description is required']
    },
    howToUse:{
        type:String,
        required:[true,'How-to-use description is required']
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"brands"
    },
    stock:{
        type:Number,
        required:[true,'Stock is required'],
        min:0
    },
    fakeCost:{
        type:Number,
        required:[true,'Fake cost is required'],
        min:0
    },
    actualCost:{
        type:Number,
        required:[true,'Actual cost is required'],
        min:0
    },
    form:{
        type:String
    },
    productType:{
        type:String
    },
    size:{
        type:String
    },
    sold:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
   });
 
   productSchema.index({ name: 'text', title: 'text' });
   module.exports = mongoose.model('products', productSchema);