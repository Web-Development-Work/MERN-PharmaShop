const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Category name can not be null"]
    },
    image:{
        type:String,
        required:[true,"Category image can not be null"]
    },
    createdDate:{
        type:Date,
        default:Date.now()
    },
    enabled:{
        type:Boolean,
        default:true
    }
})

const categorySchema = new mongoose.Schema({
     name:{
         type:String,
         required:[true,"Category name can not be null"],
         unique:true
     },
     image:{
         type:String,
         required:[true,"Category image can not be null"]
     },
     createdDate:{
         type:Date,
         default:Date.now()
     },
     subcategories:[subCategorySchema],
     enabled:{
         type:Boolean,
         default:true
     }
   });
   categorySchema.index({name:'text','name':"text"})
   module.exports = mongoose.model('categories', categorySchema);