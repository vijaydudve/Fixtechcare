const JWT = require("jsonwebtoken")

const AuthenticateUser = async (req,res,next)=>{
    try{
        const token = req.cookies.JWtoken
        const verigyToken = JWT.verify(token,"VIJAYVJCOSNOCSN",(err,decode)=>{
            if(err){
                return res.status(400).send({message:'auth failed'})
            }else{
                req.body.userId = decode._id
                next()
            }
        })
    }
    catch(err){
        res.status(401).send({error:"no token found"})
        console.log(err)
    }
}

module.exports = AuthenticateUser