const express=require('express');

const app=express();

app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.get("/animal",(req,res)=>{
    res.send("hello animal");
});

app.listen(5000,()=>{
    console.log(`listening at port 5000`)
});