const express = require('express')
const Admin = require('../models/Admin')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const mongoose = require('mongoose')
const History = require('../models/History')
const ComHistory = require('../models/ComHistory')
const UserPayment = require('../models/UserPayment')

const router = express.Router()

router.post('/adminregister', async (req, res) => {
    try {
        const adminexist = await Admin.findOne({ email: req.body.email })
        if (adminexist) {
            return res.status(200).send({ success: false, message: "email already exist" })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const admin = new Admin(req.body)
        await admin.save()
        return res.status(200).send({ success: true, message: "successfully registered" })
    } catch (err) {
        console.log(err)
    }
})

router.post('/adminlogin', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send({ error: "please fill login details" })
    }
    try {
        const response = await Admin.findOne({ email: email })
        if (!response) {
            return res.status(400).send({ error: "not found/not registered" })
        }
        const passwordcheck = await bcrypt.compare(password, response.password)
        if (passwordcheck) {
            token = await response.generateAuthToken()
            res.cookie("JWtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })
            return res.status(200).send({ message: "successfully login", token })
        }
        res.status(200).send({success:false, message: "login failed" })
    } catch (err) {
        console.log(err)
    }
})

router.get('/channelpartersbycountry/:country', async (req, res) => {
    try {
        const country = req.params.country
        const data = await User.find({ country }, 'referralID')
        const referralIDs = data.map(user => user.referralID);
        res.status(200).send({ success: true, message: 'successfully fetched all referral id by country', data: referralIDs })
    } catch (err) {
        console.log(err)
    }
})

router.get('/channelpartnerbyreferralid/:referralID', async (req, res) => {
    try {
        const referralID = req.params.referralID
        const data = await User.findOne({ referralID })
        const newdata = data
        res.status(200).send({ success: true, message: 'fetched data by referral id in admin', data: newdata })

    } catch (err) {
        console.log(err)
    }
})
router.post('/sendmessgetouser/:referralID', async (req, res) => {
    try {
        const referralID = req.params.referralID
        const { message } = req.body
        const data = await User.findOne({ referralID })
        if (!data) res.status(400).send({ success: false, message: 'could not get data of this referral id' })
        const notifications = data.notifications
        notifications.push(message)
        await User.findByIdAndUpdate(data._id, { notifications })
        res.status(200).send({
            success: true,
            message: 'note has been added successfully',
        },)
    } catch (err) {
        console.log(err)
    }
})

router.post('/updatecprefhistory/:referralID', async (req, res) => {
    try {
        const referralID = req.params.referralID
        const { cpreferralhistory } = req.body
        const user = await User.findOne({ _id: referralID })
        if (!user) res.status(200).send({ success: false, message: 'no use found' })
        const data = new History({ ...cpreferralhistory, referralID: user.referralID })
        await data.save()
        user.referralHistory.push(data._id)
        await user.save()
        res.status(200).send({ success: true, message: 'successfully updated the referralhistory' })

    } catch (err) {
        console.log(err)
    }
})

router.post('/updatecpcommissionhistory/:referralID', async (req, res) => {
    try {
        const referralID = req.params.referralID
        const { cpCommissionhistory } = req.body
        const user = await User.findOne({ _id: referralID })
        if (!user) res.status(200).send({ success: false, message: 'no use found' })
        const data = new ComHistory({ ...cpCommissionhistory, referralID: user.referralID })
        await data.save()
        user.CommissionHistory.push(data._id)
        await user.save()
        res.status(200).send({ success: true, message: 'successfully updated the commissionhistory' })

    } catch (err) {
        console.log(err)
    }
})

router.get('/getuserpaymentdetails/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findOne({ _id: id })
        if (!user) return res.status(200).send({ success: false, message: "user not found" })
        const paymentids = user.userpayment
        const stringIds = paymentids.map(objectId => objectId.toString());
        const data = await UserPayment.find({ _id: { $in: stringIds } }).exec();
        res.status(200).send({ success: true, message: 'successfully fetched payment details', data })
    } catch (err) {
        console.log(err)
    }
})




module.exports = router