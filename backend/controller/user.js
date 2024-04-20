
const { sendVerficationEmail } = require("../helper/mailer");
const { generateToken } = require("../helper/tokens");
const { validateEmail, validateLength, validateUsername } = require("../helper/validation");
const user=require("../models/user")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
exports.register=async(req,res)=>{
    try {
        const {

            first_name,
            last_name,
            email,
            password,
            username,
            bYear,
            bMonth,
            bDay,
            gender
        }=req.body;
        //validation of data 
        if(!validateEmail(email)){
            return res.status(400).json({
                message:'invalid email address'
            })
        }
        
        const check=await user.findOne({email});
        if(check){
            return res.status(400).json({
                message:"this email address is already exists try with different email"
            })
        }

        if(!validateLength(first_name,3,30)){
            return res.status(400).json({
                message:"first name should be between 3 to 30 characters"
            })
        }
        if(!validateLength(last_name,3,30)){
            return res.status(400).json({
                message:"last name should be between 3 to 30 characters"
            })
        }
        if(!validateLength(password,6,30)){
            return res.status(400).json({
                message:"password should be atleast 6 characters"
            })
        }

        const cryptedPassword=await bcrypt.hash(password,12);
        //console.log(cryptedPassword)

        let tempUsername=first_name+last_name;
        let newUsername=await validateUsername(tempUsername)
        const regUser = await new user({
            first_name,
            last_name,
            email,
            password:cryptedPassword,
            username:newUsername,
            bYear,
            bMonth,
            bDay,
            gender,
        }).save();
        const emailVerificationToken=generateToken(
            {id:regUser._id.toString()},"30m"
        )
        
        console.log(emailVerificationToken)
        const url= `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
        sendVerficationEmail(regUser.email,regUser.first_name,url)
        const token=generateToken({id:regUser._id.toString()},"7d")
        res.send({
            id:regUser._id,
           username:regUser.username,
            picture:regUser.picture,
            first_name:regUser.first_name,
            last_name:regUser.last_name,
           token:token,
            verified:regUser.verified,
            message:"Register Success! please activate your email to start",
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
} 

exports.activateAccount=async(req,res)=>{
    const {token}=req.body;
    const User=jwt.verify(token,process.env.TOKEN_SECRET)
    const check=await user.findById(User.id)
    if(check.verified==true){
        return res.status(400).json({message:"this email is already activated"})
    }else{
        await user.findByIdAndUpdate(User.id,{verified:true})
        return res.status(200).json({message:"account has been activated successfully"})
    }
}

exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body
        const User=await user.findOne({email})
        if(!User){
            return res.status(400).json({message:"the email you entered is not connected to an account"}) 
        }
        const check=await bcrypt.compare(password,User.password)
        if(!check){
            return res.status(400).json({message:"invalid credentials please try again."})
        }
        const token=generateToken({id:User._id.toString()},"7d")
        res.send({
            id:User._id,
           username:User.username,
            picture:User.picture,
            first_name:User.first_name,
            last_name:User.last_name,
           token:token,
            verified:User.verified,
            message:"Register Success! please activate your email to start",
        })
        
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}