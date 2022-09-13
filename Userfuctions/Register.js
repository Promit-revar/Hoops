const models=require('../models.js');
const http = require('http');
const config=require('config');
const qs = require('querystring');
const storage = require('node-sessionstorage')
const jwt=require('jsonwebtoken');

async function Register(data,res){
   
    //console.log(data);
    const result = await models.User
    .find({mob:data.mob});
    console.log(res);
    
    
    data.DOB=new Date(data.DOB);
    
    
    if(result.length == 0)
   {   
    var OTP = (Math.random().toString()).slice(2,8);
   
    storage.setItem('otp', OTP);
    storage.setItem('data', data);
        console.log(OTP);
        
      otp(data.mob,OTP);
       //console.log(result);
       res.status(200).send({message:`OTP sent on ${data.mob}`});
    }
   else{
       
       res.status(401).send({Sucess:false,error:`There is a user already registered with ${data.mob}!`});
       
        
   }

}

function otp(mob,OTP){
    var options = {
        "method": "GET",
        "hostname": "2factor.in",
         "port": null,
         "path": `/API/V1/${config.get('OTP.key')}/SMS/${mob}/${OTP}`,
         "headers": {
         "content-type": "application/x-www-form-urlencoded"
    }
  };
  //console.log(options);
  //console.log(OTP);
  var request = http.request(options, (response)=> {
    var chunks = [];
  
    response.on("data", (chunk)=> {
      chunks.push(chunk);
    });
  
    response.on("end",()=> {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
   
   request.write(qs.stringify({}));
   request.end();
   

}
async function verify(otp,res){
    var x = storage.getItem("otp");
    //console.log(x)
    if(otp===x){
      var data=storage.getItem("data");
      data.verified=true;
      const obj=new models.User(data);
      const result=await obj.save();
      //console.log(result);
      const token = jwt.sign(
         result.toJSON(),
        'secret'
    );
   
       res.json({
        success: true,
        token: token,
        data: {name:result['name'],mob:result.mob}
    });
      
   }
    else{

      res.status(401).send({
      Success: false,
      error: "OTP mismatch"      
  });
    }
}
module.exports={
    reg: Register,
    verify: verify,
  };