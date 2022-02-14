const mongoose = require('mongoose');


const brandSchema = new mongoose.Schema({
     name:{
         type:String,
         required:[true,"Brand name can not be null"]
     },
     image:{
         type:String,
         required:[true,"Brand image can not be null"]
     },
     createdDate:{
         type:Date,
         default:Date.now()
     },
     enabled:{
         type:Boolean,
         default:true
     }
   });
   brandSchema.index({name:'text','name':"text"})
   module.exports = mongoose.model('brands', brandSchema);