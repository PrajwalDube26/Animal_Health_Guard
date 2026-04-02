const express=require('express');

const app=express();

app.get('/',(req,res)=>{
    res.send("Hello World");
    res.end();
});

app.get("/animal",(req,res)=>{
    res.send("hello animal");
    res.end();
});

app.listen(5000,()=>{
    console.log(`listening at port 5000`)
});