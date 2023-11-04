const express = require('express')
const IndAdmin = require('../models/induser/IndAdmin')
const IndUser = require('../models/induser/IndUser')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const mongoose = require('mongoose')
const ServiceHis = require('../models/induser/ServiceHis')

const router = express.Router()

router.post('/adminregister', async (req,res)=>{
    try{
        const adminexist = await IndAdmin.findOne({email:req.body.email})
        if(adminexist){
            return res.status(400).send({success:false,message:"email already exist"})
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        req.body.password = hashedPassword
        const admin = new IndAdmin(req.body)
        await admin.save()
        return res.status(200).send({success:true,message:"successfully registered"})
    }catch(err){
        console.log(err)
    }
})

router.post('/adminlogin',async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).send({error:"please fill login details"})
    }
    try{
        const response = await IndAdmin.findOne({email:email})
        if(!response){
            return res.status(400).send({error:"not found/not registered"})
        }
        const passwordcheck = await bcrypt.compare(password,response.password)
        if(passwordcheck){
            token  = await response.generateAuthToken()
            res.cookie("JWtoken",token,{
                expires: new Date(Date.now() + 25892000000),
                httpOnly:true
            }) 
            return res.status(200).send({message:"successfully login",token})
        }
        res.status(400).send({message:"login failed"})
    }catch(err){
        console.log(err)
    }
})

router.get('/users/:country',async (req,res)=>{
    try{
        const country = req.params.country
        const data = await IndUser.find({ country: country }).exec();
        const userDetails = data.map(user => ({
            name: user.firstName + " " + user.middleName + " " + user.lastName,
            _id: user._id.toString()
        }));
        res.status(200).send({success:true,message:'successfully fetched users id by country',data:userDetails})
    }catch(err){
        console.log(err)
    }
})

router.get('/userdetailbyid/:id',async (req,res)=>{
    try{
        const userID = req.params.id
        const data = await IndUser.findById({_id:userID})
        const userData = data.toObject();
        const newData = {
            ...userData,
            password: undefined
          };
        res.status(200).send({success:true,message:'fetched data by referral id in admin',data:newData})

    }catch(err){
        console.log(err)
    }
})


router.post('/updateservicehistory/:id',async (req,res)=>{
    try{
        const userid= req.params.id
        const {servicehistory} = req.body
        const user = await IndUser.findOne({_id:userid})
        if(!user) res.status(200).send({success:false,message:'no user found'})
        const newdata = new ServiceHis({...servicehistory,userid:userid})
        await newdata.save()
        user.servicehistory.push(newdata._id)
        await user.save()
        res.status(200).send({success:true,message:'successfully updated the service history'})

    }catch(err){
        console.log(err)
    }
})




module.exports = router