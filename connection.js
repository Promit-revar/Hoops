const mongoose=require('mongoose');
const config=require('config');
const url=`mongodb+srv://${config.get('database.username')}:${config.get('database.password')}@hoops.f1xi1.mongodb.net/${config.get('database.name')}?retryWrites=true&w=majority`;



module.exports={
    connect:function(){
    mongoose.connect(url)
       .then(()=>{console.log('connected...')})
       .catch(err=>console.error("Connection failed...",err));
    
}
}
