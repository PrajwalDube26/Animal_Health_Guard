const express=require('express');
const router=express.Router();

router.get('/Login',(req,res)=>{
    res.status(200).send("this is Login in auth api");
});

router.get('/Signup',(req,res)=>{
    res.status(200).send("this is Signup in auth api");
});

router.post("/Login",(req,res)=>{
    const name=req.body.name;
    console.log(name);
    res.status(200).send(`this is my name ${name}`);
});
    
module.exports=router;