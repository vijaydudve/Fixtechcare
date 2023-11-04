const express = require('express')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const AuthenticateUser = require('../middlewares/AuthenticateUser')
const IndUser = require('../models/induser/IndUser')
const ServiceHis = require('../models/induser/ServiceHis')

const router = express.Router()

router.post('/induserregister', async (req, res) => {
    try {

        const user = req.body
        const userexist = await IndUser.findOne({ email: user.email })
        if (userexist) {
            return res.status(200).send({ success: false, message: 'email already exist' })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const userdata = new IndUser(user)
        await userdata.save()
        return res.status(200).send({ success: true, message: "user successfully registered" })
    } catch (err) {
        console.log(err)
    }
})


router.post('/induserlogin', async (req, res) => {
    const user = req.body
    try {
        const response = await IndUser.findOne({ email: user.email })
        if (!response) {
            return res.status(200).send({ success: false, error: "not found/not registered" })
        }
        const passwordcheck = await bcrypt.compare(user.password, response.password)
        if (passwordcheck) {
            token = await response.generateAuthToken()
            res.cookie("JWtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })
            return res.status(200).send({ success: true, message: "successfully login", token })
        }
        res.status(200).send({ success: false, message: "login failed" })
    } catch (err) {
        console.log(err)
    }
})


router.post('/getUserData', AuthenticateUser, async (req, res) => {
    try {
        const user = await IndUser.findOne({ _id: req.body.userId })
        if (!user) {
            return res.status(200).send({ success: false, message: 'user not found' })
        }
        else {
            res.status(200).send({
                success: true, message: "successfully fetched user data", data: user
            })
        }
    } catch (err) {
        console.log(err)
    }
})

router.post('/updateuserdetails', AuthenticateUser, async (req, res) => {
    try {
        const data = req.body
        const { userId, ...newdata } = data
        const user = await IndUser.findOneAndUpdate({ _id: data.userId }, req.body)
        res.status(200).send({
            success: true,
            message: 'user details updated',
        })
    } catch (err) {
        res.status(200).send({
            success: false,
            message: 'error in user details update',
        })
    }
})

router.post('/updatepassword', AuthenticateUser, async (req, res) => {
    try {
        const data = req.body
        const user = await IndUser.findOne({ _id: req.body.userId })
        if (!user) res.status(200).send({ success: false, message: 'user not found' })
        const passwordcheck = await bcrypt.compare(data.currentpassword, user.password)
        if (passwordcheck) {
            if (user.newpassword === user.confirmpassword) {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(data.newpassword, salt)
                const newdata = {
                    password: hashedPassword
                }
                const user = await IndUser.findOneAndUpdate({_id:data.userId},newdata)
                await user.save()
                return res.status(200).send({success:true,message:'successfully updated password'})
            }
            return res.status(200).send({success:false,message:'confirmpassword does not match'})
        }
        return res.status(200).send({success:false,message:'wrong password'})
    } catch (err) {
        console.log(err)
    }
})

router.get('/servicehistories',AuthenticateUser, async (req,res)=>{
    try{
        const user = await IndUser.findOne({_id:req.body.userId})
        if(!user) res.status(200).send({success:false,message:'user not found'})
        const servicehistories = user.servicehistory
        const stringIds = servicehistories.map(objectId => objectId.toString());
        const history = await ServiceHis.find({ _id: { $in: stringIds } }).exec();
        res.status(200).send({success:true,message:'successfully fetched the service histories',data:history})
    }catch(err){
        console.log(err)
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('JWtoken', path = '/induserhome')
    res.status(200).send({ success: true, message: 'successfully logout' })
})


module.exports = router