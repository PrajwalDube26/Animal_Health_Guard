const express=require('express');
const app=express();
const auth_router=require("./router/User_Management");

const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/animal")
.then(()=>{console.log("connection succesful to database")})
.catch((err)=>{console.log(err)});


app.use(express.json());              //for JSON data
app.use(express.urlencoded({extended:true}));  //for form-data / x-www-form-urlencoded

app.use("/api/auth",auth_router);

app.listen(5000,()=>{
    console.log(`listening at port 5000`)
});