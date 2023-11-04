const express = require('express')
const connecttodb = require('./db')
const cookieparser = require('cookie-parser')
const path = require('path')

const app = express()
app.use(express.json());
app.use(cookieparser())

app.use('/api',require('./routes/userroute'))
app.use('/api',require('./routes/adminroutes'))
app.use('/api/individual',require('./routes/induserroutes'))
app.use('/api/individual',require('./routes/indadminroutes'))

app.use(express.static(path.join(__dirname,'./client/build')))
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

connecttodb()

app.listen(5000,()=>{
    console.log('server connected')
})