const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name: String,
    Gender: String,
    mob: String,
    DOB: Date,
    verified: {type:Boolean,default:false}

});
const MatchSchema=new mongoose.Schema({
    team1:String,
    team2:String,
    table_rafree:String,
    floor_rafree1:String,
    floor_rafree2:String,
    floor_rafree3: String,
    venue:String,
    city:String,
    Date_time:{ type : Date, default: Date.now }
});
const TeamSchema= new mongoose.Schema({
      name:String,
      coach: {type:Object,default:null},
      AsstCoach:{type:Object,default:null},
      players:[Object]
      

});
const Team=mongoose.model('teams',TeamSchema);
const User=mongoose.model('users',UserSchema);
const Match=mongoose.model('matches',MatchSchema);
module.exports={User:User,Match:Match,Team:Team};