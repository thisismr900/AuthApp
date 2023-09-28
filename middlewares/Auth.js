//3 middlewares - auth, isStudent, isAdmin

//auth  middleware checks authenticity using jwt token
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res, next) => {
    //Authenticated if valid token
    try{
        //extract JWT token from either req.body OR from cookie OR from header of JWT header , wherevere present
        const token =req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer",""); 
    
        if(!token){
            return res.status(401).json({
                success:false,
                message: "Token missing"
            })
        }

        //verify token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            req.user = payload;
        }catch(error){
            return res.status(401).json({
                success:false,
                message: "Invalid Token"
            })
        }

        next();

    } catch(error) {
        return res.status(401).json({
            success:false,
            message: "Something went wrong while verifying token"
        })
    }
}




//isStudent
exports.isStudent = ( req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message: "Unauthorised Access to Student Route"
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message: "User Role is not matching"
        })
    }
} 


//isAdmin
exports.isAdmin = ( req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message: "Unauthorised Access to Admin Route"
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message: "User Role is not matching"
        })
    }
}