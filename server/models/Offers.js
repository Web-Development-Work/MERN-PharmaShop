const mongoose = require('mongoose');


const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Offer name can not be null"]
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    enabled: {
        type: Boolean,
        default: true
    },
    validTill:{
        type: Date,
        required:[true,'Offer validity is required']
    },
    discountPercent:{
        type:Number,
        required:[true,'Offer Discount is required']
    },
    coverImage:{
        type:String,
        required:[true,'Offer Cover is required']
    },
    offerCode:{
        type:String,
        required:[true,'Offer Code is required']
    }
});
module.exports = mongoose.model('offers', offerSchema);