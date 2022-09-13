const express = require('express');

const route=express.Router();
const reg=require('./Userfuctions/Register.js');
const login=require('./Userfuctions/login.js');
const match=require('./Userfuctions/Match.js');



route.get("/",(req,res)=>{
    res.send("<h1>Welcome to hoops API!!</h1>");
});
route.post("/login",(req,res)=>{
    login.log(req.body,res);
    //res.send("OTP sent");
    
});
route.post("/verifylogin/:mob/:otp",(req,res)=>{
    login.verify(req.params.otp,res);
    //res.send("Verifying...");
    
});
route.post("/verify/:mob/:otp",(req,res)=>{
       reg.verify(req.params.otp,res);
      // res.send("Verifying..."); 
});
route.post("/register/", (req,res)=>{
    
    //console.log(reg);
    
    reg.reg(req.body,res);
    
    //res.send("Sent");
   
    
  
});
route.post("/match/",(req,res)=>{
    match.CreateMatch(req.body,res);
    //res.send("This is match route!!");
});
route.post("/team/:name",(req,res)=>{
    //team route
});
route.get("/matchSearch/:venue/:city/:team",match.getMatches(),(req,res)=>{
    //match.getMatches(req.params,req.query);
    //get match route...
    res.json(res.getMatches);
});
module.exports=route;