const express=require('express');
const router=express.Router();

router.get('/Login',(req,res)=>{
    res.status(200).send("this is Login in auth api");
});

router.get('/Signup',(req,res)=>{
    res.status(200).send("this is Signup in auth api");
});

module.exports=router;