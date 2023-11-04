const express = require('express')
const User = require('../models/User')
const Admin = require('../models/Admin')
// const bcrypt = require('bcrypt')
// const JWT = require('jsonwebtoken')
const AuthenticateUser = require('../middlewares/AuthenticateUser')
const History = require('../models/History')
const ComHistory = require('../models/ComHistory')
const UserPayment = require('../models/UserPayment')

const router = express.Router()

router.post('/userregister', async (req, res) => {
    try {
        const user = req.body
        const admin = await Admin.findOne({ email: 'a@a.com' })
        if (!admin) {
            return res.status(200).send({ success: false, message: 'admin not present' })
        }
        // admin password 1
        admin.UserID.push(user.referralID)
        await admin.save()
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${day}/${month}/${year}`;
        const data = { ...user, idActivateOn: formattedDate, address: "" }
        const userexist = await User.findOne({ email: user.email })
        if (userexist) {
            return res.status(200).send({ success: false, message: 'email already exist' })
        }
        const userdata = new User(data)
        await userdata.save()
        return res.status(200).send({ success: true, message: "user successfully registered" })
    } catch (err) {
        console.log(err)
    }
})


router.post('/userlogin', async (req, res) => {
    const { referralID } = req.body
    if (!referralID) {
        return res.status(400).send({ error: "please fill login details" })
    }
    try {
        const response = await User.findOne({ referralID })
        if (!response) {
            return res.status(200).send({success:false, error: "not found/not registered" })
        }
        if (referralID === response.referralID) {
            token = await response.generateAuthToken()
            res.cookie("JWtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })
            return res.status(200).send({success:true, message: "successfully login", token })
        }
        res.status(200).send({ message: "login failed" })
    } catch (err) {
        console.log(err)
    }
})

router.get('/getallreferralid', async (req, res) => {
    try {
        const response = await Admin.findOne({ email: "a@a.com" })
        // password is 1 
        if (!response) {
            return res.status(200).send({ success: false, message: 'failed to get all referral ids' })
        }
        const referralIDS = response.UserID
        return res.status(200).send({ success: true, message: 'here is all referral ids', data: referralIDS })
    } catch (err) {
        console.log(err)
    }
})


router.post('/getUserData', AuthenticateUser, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
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
        const user = await User.findOneAndUpdate({ _id: data.userId }, req.body)
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

router.get('/referralhistorybyid', AuthenticateUser, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        if (!user) res.status(200).send({ success: false, message: 'user not found' })
        const refhistories = user.referralHistory
        const stringIds = refhistories.map(objectId => objectId.toString());
        const history = await History.find({ _id: { $in: stringIds } }).exec();
        res.status(200).send({ success: true, message: 'successfully fetched the referral histories', data: history })
    } catch (err) {
        console.log(err)
    }
})
router.get('/commissionhistorybyid', AuthenticateUser, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        if (!user) res.status(200).send({ success: false, message: 'user not found' })
        const comhistories = user.CommissionHistory
        const stringIds = comhistories.map(objectId => objectId.toString());
        const history = await ComHistory.find({ _id: { $in: stringIds } }).exec();
        res.status(200).send({ success: true, message: 'successfully fetched the referral histories', data: history })
    } catch (err) {
        console.log(err)
    }
})

router.post('/paymentdetails', AuthenticateUser, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        if (!user) return res.status(200).send({ success: false, message: "user not found" })
        const payment = new UserPayment(req.body)
        await payment.save()
        user.userpayment.push(payment._id)
        await user.save()
        res.status(200).send({ success: true, message: "successfully update payment details" })
    } catch (err) {
        res.status(200).send({
            success: false,
            message: 'error in user details update',
        })
    }
})

router.post('/updatenotifications',AuthenticateUser,async (req,res)=>{
    try{
        const user = await User.findOne({_id:req.body.userId})
        let seennotifications = user.seenNotifications || []
        let notifications = user.notifications || []
        seennotifications.push(...notifications)
        user.seenNotifications = seennotifications
        user.notifications = []
        await user.save()
        return res.status(200).send({success:true,message:'updated seen notification'})
    }catch(err){
        console.log(err)
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('JWtoken', path = '/userhome')
    res.status(200).send({ success: true, message: 'successfully logout' })
})


module.exports = router