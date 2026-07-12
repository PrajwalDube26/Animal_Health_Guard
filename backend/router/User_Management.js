const express=require('express');
const router=express.Router();

const {register,login,user_profile,user_update} = require('../controller/user')
const featchuser = require('../middleware/featchuser');


router.post('/Signup',register);
router.post('/Login',login);

router.get("/getuser",featchuser,user_profile);
router.put("/edit_user",featchuser,user_update);
    
module.exports=router;