const express=require("express");
const router=express.Router();
const {auth, isStudent, isAdmin} = require("../middlewares/Auth")


//import controller for login and signin
const {login,signup} = require("../controllers/Auth");

router.post("/login",login);
router.post("/signup",signup);

//protected route - TEST 
router.get("/test",auth, (req,res) => {
    res.json({
        success:true,
        message:"Welcome to protected route for TEST"
    })
})
//protected route - authorised role can visit particular route
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to protected route for Students"
    })
})

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to protected route for Admin"
    })
})

module.exports=router;