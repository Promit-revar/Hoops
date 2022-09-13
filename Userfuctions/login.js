const models=require('../models.js');
const storage = require('node-sessionstorage')
const http = require('http');
const config=require('config');
const qs = require('querystring');
const jwt=require('jsonwebtoken');
async function Login(data,res){

    
    
    
    //console.log(data);
   
    result = await models.User.find({mob:data.id});
   
    //console.log(result);
    
    if(result.length == 0)
    {    
        
       res.status(404).send({ sucess:false, error: "User dosen't exist" });
       
    }
    else{
        
        var OTP = (Math.random().toString()).slice(2,8);
        storage.setItem('otp', OTP);
        storage.setItem('data', result[0]);
        res.status(200).send({message:`OTP sent on ${result[0].mob}`});
        otp(data.id,OTP);
        
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
  // console.log(options);
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
    
    const result=await data.save();
      const token = jwt.sign(
        data.toJSON(),
        'secret'
    );
        res.status(200).send({success: true,
          token: token,
          data: {name:storage.getItem("data").name,mob:storage.getItem("data").mob}
      });
   }
    else{
        res.status(401).send({success:false, error:"OTP Mismatch"});
    }
}
module.exports={
    log: Login,
    verify: verify,
  };