//npm init -y ; npm i express ;npm i nodemon ; npm i mongoose ;npm i dotenv
const express=require("express");
const app=express();

require("dotenv").config(); 

const PORT= process.env.PORT || 3000;


const cookieParser=require("cookie-parser");
app.use(cookieParser());

app.use(express.json());//use middleware for parsing

require("./config/databse").connect();

//import route and mount
const user=require("./routes/user");
app.use("/api/v1",user);

//activate server
app.listen(PORT,()=>{
    console.log(`App running at PORT : ${PORT}`);
})


//HW_ What is Cookie parse  & Why it is required