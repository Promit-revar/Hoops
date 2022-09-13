const express=require('express');
const morgan=require('morgan');
const app=express();
const routes=require('./routes.js');
const conc=require('./connection.js');
const port=process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('media'));
conc.connect();
if(app.get('env')==='development'){
app.use(morgan("dev"));
}
app.use(routes);
app.listen(port,e=>{
    console.log(`Server started at ${port}..`);
});