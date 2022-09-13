const models=require('../models.js');
// const storage = require('node-sessionstorage')
// const http = require('http');
// const config=require('config');
// const qs = require('querystring');
// const jwt=require('jsonwebtoken');

async function match_making(data,res){
    
    var dt=(data.date).split("-");
    var tt=(data.time).split(":");
    
    var d=new Date(parseInt(dt[0]), parseInt(dt[1],10), parseInt(dt[2]), parseInt(tt[0],10), parseInt(tt[1],10));
    // console.log(d.getHours()); // Hours
    // console.log(d.getMinutes());
    console.log(d.getDate());
    // console.log(d)
    const r = await models.Match
    .find({venue:data.venue,city:data.city});
    var m=-1;
    for(var i=0;i<r.length;i++){
       
        if((Math.abs((r[i].Date_time)-d)/60000)<=60){
              m=i;
              
              break;
        }
        if(Math.abs((r[i].Date_time).getHours()-d.getHours())>=23){
            m=i;
            break;
        }
    }
    //console.log(data);
    const t1 = await models.Match
    .find({$or:[{team1:data.team1},{team2:data.team1}]});
    const t2=await models.Match
    .find({$or:[{team1:data.team2},{team2:data.team2}]});
    var n1=-1;
    console.log(t1);
    //console.log(t2);
    for(var i=0;i<t1.length;i++){
       var k=t1[i].Date_time;
       
        if(((Math.abs(k-d))/60000)<=60){
              n1=i;
              
              break;
        }
        console.log((d-k)/60000);
        if(Math.abs(k.getHours()-d.getHours())>=23){
            n1=i;
            break;
        }
    }
    var n2=-1;
    for(var i=0;i<t2.length;i++){
       
        if((Math.abs((t2[i].Date_time)-d)/60000)<=60){
              n2=i;
              
              break;
        }
        if(Math.abs((t2[i].Date_time).getHours()-d.getHours())>=23){
            n2=i;
            break;
        }
    }
    // storage.setItem('otp', OTP);
    // storage.setItem('data', data);
    const obj=new models.Match({team1:data.team1,
        team2:data.team2,
        table_rafree:data.trf,
        floor_rafree1:data.Fr1,
        floor_rafree2:data.Fr2,
        floor_rafree3: data.Fr3,
        venue:data.venue,
        city:data.city,
        Date_time:d});
    const result=await obj.save();
    
    if(m!=-1){
        
        var mins=(r[m].Date_time).getMinutes();
        var hrs=(r[m].Date_time).getHours();
        if(mins==0){
            mins="00";
        }
        if(hrs==0){
            hrs="00";
        }
    res.status(200).send({success:true,warning:`There is match between ${r[m].team1} and ${r[m].team2} in ${r[m].venue} on the same day at ${hrs}:${mins}`});
    }
    else if(n1!=-1 ){
       
        var mins=(t1[n1].Date_time).getMinutes();
        var hrs=(t1[n1].Date_time).getHours();
        if(mins==0){
            mins="00";
        }
        if(hrs==0){
            hrs="00";
        }
    res.status(200).send({success:true,warning:`Team ${data.team1} has match on the same day at ${hrs}:${mins}`});
    }
    else if(n2!=-1 ){
        
        var mins=(t2[n2].Date_time).getMinutes();
        var hrs=(t2[n2].Date_time).getHours();
        if(mins==0){
            mins="00";
        }
        if(hrs==0){
            hrs="00";
        }
        res.status(200).send({success:true,warning:`Team ${data.team2} has match on the same day at ${hrs}:${mins}`});
    }
    else{
        res.status(200).send({success:true});    
    }
    
}

function getMatches(){
    
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        console.log(req.params);
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
    
        const results = {}
    
        if (endIndex < await models.Match.countDocuments().exec()) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }
        
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }
        try {
          results.results = await models.Match.find({$or:[{venue:req.params.venue},{city:req.params.city},{team1:req.params.team},{team2:req.params.team}]}).limit(limit).skip(startIndex).exec()
          res.getMatches = results
          next()
        } catch (e) {
          res.status(500).json({ message: e.message })
        }
        
     }
    
 }
module.exports={CreateMatch:match_making,getMatches:getMatches};