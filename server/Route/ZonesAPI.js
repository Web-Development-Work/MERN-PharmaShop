const Zone = require('../models/Zone')
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const haversineDistance = require('../HandleFunction/HaversineFunction')

//Add Zone

app.post('/api/addZone', (req, res) => {
    /**
     name: String,
     longitude: Number,
     latitude: Number,
     deliverRange:[{
         from:Number,
         to:Number,
         charges:Number
     }]
     */
    if (req.body.name && req.body.longitude!==undefined && req.body.latitude!==undefined && req.body.deliveryRange) {
       let {name,longitude,latitude,deliveryRange} = req.body
       let geometry = {
        type:"Point",
        coordinates:[longitude,latitude]
       }
       let zone = {
           name,
           geometry,
           deliveryRange
       }
       Zone.create(zone,(err,doc)=>{
           if(err)return res.json(handleErr(err))
           else{
               return res.json(handleSuccess(doc))
           }
       })
    } else {
        return res.json(handleErr('Zone can not be nulll'))
    }
})

//Get all zones
app.post('/api/getAllZones', (req, res) => {
    Zone.find({}).sort({ createdDate: -1 }).exec((err, docs) => {
        if (err) return res.json(handleErr(err))
        else {
            return res.json(handleSuccess(docs))
        }
    })
})

//Get nearest Zone
app.post('/api/getNearestZone',(req,res)=>{
    if (req.body.longitude && req.body.latitude) {
        Zone.find({
          geometry: {
            $nearSphere: {
              $geometry: {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude], //longitude and latitude
              },
              $minDistance: 0,
              $maxDistance: 10 * 1000,
            },
          },
          enabled: true
        })
          .limit(1)
          .exec((err, doc) => {
            if (err) return res.json(handleErr(err));
            else{
                if(doc!==null){
                    return res.json(handleSuccess(doc))
                }else{
                    return res.json(handleErr('No deliver zone within 10 KMs'))
                }
            }
          });
      } else {
        return res.json(handleErr('Location can not be null'))
      }
})

//Get all enabled zones
app.post('/api/getAllEnabledZones', (req, res) => {
    Zone.find({ enabled: true }).sort({ createdDate: -1 }).exec((err, docs) => {
        if (err) return res.json(handleErr(err))
        else {
            return res.json(handleSuccess(docs))
        }
    })
})

//Disable Zone
app.put('/api/disableZone', (req, res) => {
    if (req.body.id) {
        let { id } = req.body
        Zone.findByIdAndUpdate(id, { enabled: false }, { new: true }, (err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Zone can not be null'))
    }
})


//Enable Zone
app.put('/api/enableZone', (req, res) => {
    if (req.body.id) {
        let { id } = req.body
        Zone.findByIdAndUpdate(id, { enabled: true }, { new: true }, (err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Zone can not be null'))
    }
})

//Update Zone
app.put('/api/updateZone',(req,res)=>{
    let data = req.body
    let {id} = data
    Zone.findByIdAndUpdate(id,data,{new:true}).exec((err,doc)=>{
        if(err)return res.json(handleErr(err))
        else{
            return res.json(handleSuccess(doc))
        }
    })
})

//Search Zone
app.post('/api/searchZones',(req,res)=>{
    if(req.body.name){
        Zone.find({ name: { $regex:req.body.name+ '.*' } })
        .limit(20)
        .exec((err, docs) => {
            if (err)
               return res.json(handleErr(err))
            else { res.json(handleSuccess(docs)) }
        });
    }else{
        return res.json(handleErr('Zone name is required'))
    }
})

app.post('/api/updateLocation',(req,res)=>{
    Zone.updateMany({},{
        $set:{
            'geometry.coordinates':[67.0817,24.8935]
        }
    },(err,docs)=>{
        if(err)return res.json(handleErr(err))
        else{
            return res.json(handleSuccess(docs))
        }
    })
})

app.post('/api/bulkLocationPrices',(req,res)=>{
    Zone.updateMany({},{
        $set:{
            deliveryRange:[
                {
                    from:0,
                    to:30,
                    charges:10
                },
                {
                    from:31,
                    to:50,
                    charges:30
                },
                {
                    from:51,
                    to:90,
                    charges:80
                }
            ]
        }
    },(err,docs)=>{
        if(err)return res.json(handleErr(err))
        else{
            return res.json(handleSuccess(docs))
        }
    })
})

//calculate zone charges
app.post('/api/calculateCharges',(req,res)=>{
    if(req.body.longitude!==undefined && req.body.latitude!==undefined){
        let {latitude,longitude} = req.body
        Zone.find({enabled:true},(err,zones)=>{
            if(err)return res.json(handleErr(err))
            else{
               let charges =  zones.map((zone)=>{
                    let distance = haversineDistance(
                        [latitude,longitude],[zone._doc.geometry.coordinates[1],zone._doc.geometry.coordinates[0]],false)
                    // console.log('distance--->',distance)
                    let ranges = zone._doc.deliveryRange.filter((x)=>x.from<=distance&&x.to>distance)
                    if(ranges.length>0){
                        return {
                            distance,
                            charges: ranges[0].charges,
                            name:zone._doc.name
                        }
                    }
                })
                let finalCharges = charges.filter((ch)=>ch&&ch!==null)
                if(finalCharges.length>0)
                return res.json(handleSuccess(finalCharges))
                else{
                    return res.json(handleErr('No delivery zone available'))
                }
            }
        })
    }
    else{
        return res.json(handleErr('Longitude and Latitude is required'))
    }
})


//Get nearest Zone charges
app.post('/api/nearestZoneCharges',(req,res)=>{
    if (req.body.longitude && req.body.latitude) {
        let {longitude,latitude} = req.body
        Zone.find({
          geometry: {
            $nearSphere: {
              $geometry: {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude], //longitude and latitude
              },
              $minDistance: 0,
              $maxDistance: 10 * 1000,
            },
          },
          enabled: true
        })
          .limit(1)
          .exec((err, zone) => {
            if (err) return res.json(handleErr(err));
            else{
                if(zone!==null){
                    // return res.json(handleSuccess(doc))
                    let distance = haversineDistance(
                        [latitude,longitude],[zone[0]._doc.geometry.coordinates[1],zone[0]._doc.geometry.coordinates[0]],false)
                    // console.log('distance--->',distance)
                    let ranges = zone[0]._doc.deliveryRange.filter((x)=>x.from<=distance&&x.to>distance)
                    if(ranges.length>0){
                        let respons = {
                            distance,
                            charges: ranges[0].charges,
                            name:zone[0]._doc.name
                        }
                        return res.json(handleSuccess(respons))
                    }
                    else{
                        return res.json(handleErr('Nearest zone not delivering in your area'))
                    }
                }else{
                    return res.json(handleErr('No deliver zone within 10 KMs'))
                }
            }
          });
      } else {
        return res.json(handleErr('Location can not be null'))
      }
})
module.exports = app