const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'Point',
    },
    coordinates: {
        type: [Number],
        index: '2dsphere',
    },
});

const deliveryRangeSchme = new mongoose.Schema({
    from:{
        type:Number,
        required:[true,'Deliver range is required'],
        min:0
    },
    to:{
        type:Number,
        required:[true,'Deliver range is required'],
        min:0
    },
    charges:{
        type:Number,
        required:[true,'Deliver range is required'],
        min:0
    }
})

const zoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Zone name can not be null"]
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    enabled: {
        type: Boolean,
        default: true
    },
    geometry: {
        type: locationSchema,
    },
    deliveryRange:[deliveryRangeSchme]         //For each deliver range, charges are varied for each zone
});
zoneSchema.index({ geometry: '2dsphere' });
zoneSchema.index({ name: 'text'});
module.exports = mongoose.model('zones', zoneSchema);