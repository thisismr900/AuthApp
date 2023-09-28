const bcrypt=require("bcrypt"); //npm i bycrypt
const User=require("../models/User");
const jwt = require("jsonwebtoken"); //npm i jsonwebtoken
require("dotenv").config();

//signup route handler
exports.signup = async (req,res) =>{
    try{

        //get data from req .body
        const {name,email,password,role} = req.body;


        //check if user already exists
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Existing User"
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash( password, 10);
        }
        catch(error) {
            return res.status(500).json({
                success:false,
                message:"Error in Hashing password"
            })
        }

        //create a entry for user in DB
        const user= await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"User Created Successfully"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User registration failed,Please try again later",
        });
    }
}


//login
exports.login = async (req,res) =>{
    try{

        //data fetch
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(500).json({
                success:false,
                message:"Please fill all the details carefully",
            });
        }

        let existingUser= await User.findOne({email});

        if(!existingUser){
            //not a registered user
            return res.status(401).json({
                success:false,
                message:"User is not Registered",
            });
        }
        const payload ={
            email:existingUser.email,
            id:existingUser._id,
            role:existingUser.role,
        }
        //verify password & generate a JWT
        if(await bcrypt.compare(password,existingUser.password))
        {
            //password matches
            let token = jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h"
                                }
                                ) 
            existingUser = existingUser.toObject();
            existingUser.token = token;
            existingUser.password = undefined;
            // const updatedUser={...existingUser,token}


            //create a cookie
            const options={
                expiresIn: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000 ),
                httpOnly:true,
            }

            //     cookie-name,cookie-content,options
            res.cookie("token", token , options).status(200).json({
                success:true,
                token,
                existingUser,
                message:"User Logged In Successfully"
            })

        }
        else{
            //password mismatch
            return res.status(403).json({
                success:false,
                message:"Password Do not match"
            })
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failed,Please try again later",
        });
    }
}