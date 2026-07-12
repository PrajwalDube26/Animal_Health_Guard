const express=require('express');
const cookieparse = require('cookie-parser');
const app=express();

const user_auth_router=require("./router/User_Management");
const farm_router=require("./router/farm_manage");
const alert_route = require('./router/Alert_manage');
const record_route = require('./router/Record_manage');
const bio_assign_route = require('./router/Bio_assig_manage');
const que_ans_route = require('./router/que_ans_manage');
const traning_module_route = require('./router/traning_module_manage');

require('dotenv').config();

const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/animal")
.then(()=>{console.log("connection succesful to database")})
.catch((err)=>{console.log(err)});


app.use(express.json());              //for JSON data
app.use(express.urlencoded({extended:true}));  //for form-data / x-www-form-urlencoded
app.use(cookieparse());

app.use("/api/auth",user_auth_router);
app.use("/api/farm",farm_router);
app.use("/api/alert",alert_route);
app.use("/api/record",record_route);
app.use("/api/bio_assig",bio_assign_route);
app.use("/api/que_ans",que_ans_route);
app.use("/api/traning_module",traning_module_route);


app.listen(5000,()=>{
    console.log(`listening at port 5000`)
});