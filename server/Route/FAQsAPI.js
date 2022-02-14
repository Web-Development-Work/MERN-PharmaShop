
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const FAQs = require('../models/FAQs')


//Add new FAQ
app.post('/api/addFAQ',(req,res)=>{
    if(req.body.question && req.body.answer){
        let data = {question,answer} = req.body
        FAQs.create(data,(err,doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(doc))
            }
        })
    }else{
        return res.json(handleErr('Question and Answer are required'))
    }
})

//Get all FAQs
app.post('/api/getAllFAQs',(req,res)=>{
    FAQs.find().sort({createdDate:-1}).exec((err,docs)=>{
        if(err)return res.json(handleErr(err))
        else{
            return res.json(handleSuccess(docs))
        }
    })
})


//Edit FAQ
app.put('/api/editFAQ',(req,res)=>{
    if(req.body.question && req.body.answer && req.body.id){
        let {id,question,answer} = req.body
        let data = {
            lastUpdated:new Date(),
            question,
            answer
        }
        FAQs.findByIdAndUpdate(id,data,{new:true}).exec((err,doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(doc))
            }
        })
    }
    else{
        return res.json(handleErr('FAQ can not be null'))
    }
})

//Delete FAQ
app.delete('/api/deleteFAQ',(req,res)=>{
    if(req.body.id){
        let {id} = req.body
        FAQs.findByIdAndDelete(id,(err,doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(doc))
            }
        })
    }else{
        return res.json(handleErr('FAQ can not be null'))
    }
})
module.exports = app